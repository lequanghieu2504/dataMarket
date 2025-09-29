package com.example.datasetapi.service.dataset;

import com.example.datasetapi.enums.DatasetStatus;
import com.example.datasetapi.ingest.InputStreamSource;
import com.example.datasetapi.model.readAndProcessCSV.Dataset;
import com.example.datasetapi.repository.DatasetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DatasetIngestionService {

    private final DatasetRepository datasetRepo;
    private final DatasetProcessor processor;

    @Transactional
    public Dataset ingest(InputStreamSource src, Long providerId, String fileName) throws Exception {
        // tạo record trước để log lỗi/row gắn dataset_id
        Dataset ds = Dataset.builder()
                .providerId(providerId)
                .fileName(fileName)
                .datasetStatus(DatasetStatus.PENDING)
                .build();
        ds = datasetRepo.save(ds);

        ds.setDatasetStatus(DatasetStatus.PROCESSING);
        ds = datasetRepo.save(ds);

        ds = processor.process(src, ds);   // đọc hết & chấm điểm
        return datasetRepo.save(ds);
    }
}
