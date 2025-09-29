package com.example.datasetapi.model.readAndProcessCSV;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="dataset_errors")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DatasetError {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long datasetId;
    private long rowNumber;    // dòng gây lỗi (1-based tính theo data, không tính header)
    @Column(length = 2000)
    private String message;
}