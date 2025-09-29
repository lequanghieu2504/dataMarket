package com.example.datasetapi.model.readAndProcessCSV;
import com.example.datasetapi.enums.DatasetQuality;
import com.example.datasetapi.enums.DatasetStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity @Table(name="datasets")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Dataset {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long providerId;
    private String fileName;
    private LocalDateTime createTime;

    @Enumerated(EnumType.STRING)
    private DatasetStatus datasetStatus;

    @Enumerated(EnumType.STRING)
    private DatasetQuality status;

    private int rowCount;
    private int validRows;
    private int errorRows;
    private int columnCount;

    @Column(length = 4000)
    private String note;
}
