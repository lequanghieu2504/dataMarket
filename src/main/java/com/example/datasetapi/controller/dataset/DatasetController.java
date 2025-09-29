package com.example.datasetapi.controller.dataset;

import com.example.datasetapi.ingest.HttpUrlStreamSource;
import com.example.datasetapi.ingest.InputStreamSource;
import com.example.datasetapi.ingest.MultipartStreamSource;
import com.example.datasetapi.model.readAndProcessCSV.Dataset;
import com.example.datasetapi.service.dataset.DatasetIngestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/datasets")
public class DatasetController {

    private final DatasetIngestionService ingestion;

    // Nhận file upload trực tiếp
    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("providerId") Long providerId,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        InputStreamSource src = new MultipartStreamSource(file);
        Dataset ds = ingestion.ingest(src, providerId, file.getOriginalFilename());
        return ResponseEntity.ok(ds);
    }

    // Nhận URL file trên cloud (http/https hoặc s3://bucket/key *)
    @PostMapping("/ingest-url")
    public ResponseEntity<?> ingestUrl(
            @RequestParam("providerId") Long providerId,
            @RequestParam("fileUrl") String fileUrl
    ) throws Exception {

        InputStreamSource src;
        if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
            src = new HttpUrlStreamSource(fileUrl);
        } else if (fileUrl.startsWith("s3://")) {
            // src = new S3StreamSource(fileUrl); // cần cài AWS SDK & cấu hình
            return ResponseEntity.badRequest().body("S3 URL supported but S3 client not wired. Enable S3StreamSource.");
        } else {
            return ResponseEntity.badRequest().body("Unsupported URL scheme");
        }

        Dataset ds = ingestion.ingest(src, providerId, fileUrl);
        return ResponseEntity.ok(ds);
    }
}
