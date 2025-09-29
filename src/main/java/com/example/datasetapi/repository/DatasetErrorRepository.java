package com.example.datasetapi.repository;

import com.example.datasetapi.model.readAndProcessCSV.DatasetError;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DatasetErrorRepository extends JpaRepository<DatasetError, Long> { }
