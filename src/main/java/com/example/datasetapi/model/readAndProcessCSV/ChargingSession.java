package com.example.datasetapi.model.readAndProcessCSV;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity @Table(name="charging_sessions")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ChargingSession {

    @Id
    private String sessionId;

    private String userId;
    private String username;
    private String carBrand;
    private String carModel;

    private String stationId;
    private String stationName;
    private String location;

    private Double latitude;
    private Double longitude;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Integer batteryStart;
    private Integer batteryEnd;

    private Double energyConsumedKWh;

    @Column(name = "dataset_id")
    private Long datasetId;
}
