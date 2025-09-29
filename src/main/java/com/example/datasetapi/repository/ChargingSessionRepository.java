package com.example.datasetapi.repository;

import com.example.datasetapi.model.readAndProcessCSV.ChargingSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChargingSessionRepository extends JpaRepository<ChargingSession, String> { }
