package com.example.datasetapi.service.dataset;

import com.example.datasetapi.csv.Headers;
import com.example.datasetapi.enums.DatasetQuality;
import com.example.datasetapi.enums.DatasetStatus;
import com.example.datasetapi.ingest.InputStreamSource;
import com.example.datasetapi.model.readAndProcessCSV.ChargingSession;
import com.example.datasetapi.model.readAndProcessCSV.Dataset;
import com.example.datasetapi.model.readAndProcessCSV.DatasetError;
import com.example.datasetapi.repository.ChargingSessionRepository;
import com.example.datasetapi.repository.DatasetErrorRepository;
import com.example.datasetapi.util.TimeParser;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.*;
import org.springframework.stereotype.Service;

import java.io.InputStreamReader;
import java.io.Reader;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DatasetProcessor {

    private final ChargingSessionRepository sessionRepo;
    private final DatasetErrorRepository errorRepo;

    // thresholds
    private static final double GREEN_MAX = 0.02; // < 2%  => green
    private static final double YELLOW_MAX = 0.08; // <= 8% => yellow, >8% => red

    public Dataset process(InputStreamSource source, Dataset dataset) throws Exception {
        dataset.setCreateTime(LocalDateTime.now());
        dataset.setDatasetStatus(DatasetStatus.PROCESSING);

        int total = 0, valid = 0, error = 0;
        boolean missingCriticalHeader = false;
        int columnCount = 0;

        // để phát hiện trùng session_id trong cùng dataset
        Set<String> seenSessionIds = new HashSet<>();
        RowValidator validator = new RowValidator();

        try (Reader reader = new InputStreamReader(source.open())) {
            CSVParser parser = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(reader);
            Map<String,Integer> headerMap = parser.getHeaderMap();
            columnCount = headerMap.size();

            // kiểm tra cột quan trọng có trong header không (nhưng vẫn đọc hết)
            if (!headerMap.keySet().containsAll(Headers.CRITICAL)) {
                missingCriticalHeader = true;
            }

            for (CSVRecord rec : parser) {
                total++;

                ChargingSession s = mapRecord(rec, dataset.getId(), headerMap);
                List<String> errs = validator.validate(s);

                // check trùng session_id trong file
                if (s.getSessionId()!=null && !seenSessionIds.add(s.getSessionId())) {
                    errs.add("duplicate session_id within dataset");
                }

                if (!errs.isEmpty()) {
                    error++;
                    errorRepo.save(DatasetError.builder()
                            .datasetId(dataset.getId())
                            .rowNumber(rec.getRecordNumber()) // 1-based (data rows)
                            .message(String.join("; ", errs))
                            .build());
                    continue;
                }

                sessionRepo.save(s);
                valid++;
            }
        }

        dataset.setRowCount(total);
        dataset.setValidRows(valid);
        dataset.setErrorRows(error);
        dataset.setColumnCount(columnCount);

        // đánh giá cuối cùng (sau khi đọc hết)
        decideFinalStatus(dataset, missingCriticalHeader);

        return dataset;
    }

    private void decideFinalStatus(Dataset d, boolean missingCriticalHeader) {
        if (d.getRowCount()==0) {
            d.setStatus(DatasetQuality.RED);
            d.setDatasetStatus(DatasetStatus.REJECTED);
            d.setNote(append(d.getNote(), "empty dataset"));
            return;
        }

        if (missingCriticalHeader) {
            d.setStatus(DatasetQuality.RED);
            d.setDatasetStatus(DatasetStatus.REJECTED);
            d.setNote(append(d.getNote(), "missing critical headers: " + Headers.CRITICAL));
            return;
        }

        double errorRate = (double) d.getErrorRows() / d.getRowCount();

        // Nếu số cột ≠ 15 ⇒ luôn Yellow (nhưng vẫn xét Red nếu errorRate > 8%)
        if (d.getColumnCount() != Headers.EXPECTED_COUNT) {
            if (errorRate > YELLOW_MAX) {
                d.setStatus(DatasetQuality.RED);
                d.setDatasetStatus(DatasetStatus.REJECTED);
            } else {
                d.setStatus(DatasetQuality.YELLOW);
                d.setDatasetStatus(DatasetStatus.WARNING);
            }
            d.setNote(append(d.getNote(),
                    "column count = " + d.getColumnCount() + " (expected " + Headers.EXPECTED_COUNT + ")"));
            return;
        }

        // Đúng 15 cột ⇒ chấm theo % lỗi
        if (errorRate < GREEN_MAX) {
            d.setStatus(DatasetQuality.GREEN);
            d.setDatasetStatus(DatasetStatus.APPROVED);
        } else if (errorRate <= YELLOW_MAX) {
            d.setStatus(DatasetQuality.YELLOW);
            d.setDatasetStatus(DatasetStatus.WARNING);
        } else {
            d.setStatus(DatasetQuality.RED);
            d.setDatasetStatus(DatasetStatus.REJECTED);
        }
    }

    private String append(String base, String more) {
        if (base == null || base.isBlank()) return more;
        return base + " | " + more;
    }

    private ChargingSession mapRecord(CSVRecord r, Long datasetId, Map<String,Integer> headerMap) {
        // getOrNull: tránh throw nếu thiếu header (để còn đếm lỗi)
        var g = (java.util.function.Function<String,String>) col ->
                headerMap.containsKey(col) ? r.get(col) : null;

        return ChargingSession.builder()
                .sessionId(g.apply("session_id"))
                .userId(g.apply("user_id"))
                .username(g.apply("username"))
                .carBrand(g.apply("car_brand"))
                .carModel(g.apply("car_model"))
                .stationId(g.apply("station_id"))
                .stationName(g.apply("station_name"))
                .location(g.apply("location"))
                .latitude(parseDouble(g.apply("latitude")))
                .longitude(parseDouble(g.apply("longitude")))
                .startTime(TimeParser.parseFlexible(g.apply("start_time")))
                .endTime(TimeParser.parseFlexible(g.apply("end_time")))
                .batteryStart(parseInt(g.apply("battery_start")))
                .batteryEnd(parseInt(g.apply("battery_end")))
                .energyConsumedKWh(parseDouble(g.apply("energy_consumed_kWh")))
                .datasetId(datasetId)
                .build();
    }

    private Integer parseInt(String v) { return (v==null||v.isBlank()) ? null : Integer.valueOf(v.trim()); }
    private Double parseDouble(String v){ return (v==null||v.isBlank()) ? null : Double.valueOf(v.trim()); }
}
