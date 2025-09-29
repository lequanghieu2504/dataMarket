package com.example.datasetapi.service.dataset;

import com.example.datasetapi.model.readAndProcessCSV.ChargingSession;

import java.util.ArrayList;
import java.util.List;

public class RowValidator {

    public List<String> validate(ChargingSession s) {
        List<String> errors = new ArrayList<>();

        if (s.getSessionId() == null || s.getSessionId().isBlank())
            errors.add("session_id is null/blank");

        if (s.getStartTime() == null) errors.add("start_time invalid");
        if (s.getEndTime() == null) errors.add("end_time invalid");
        if (s.getStartTime()!=null && s.getEndTime()!=null && !s.getStartTime().isBefore(s.getEndTime()))
            errors.add("start_time must be before end_time");

        if (s.getEnergyConsumedKWh() == null || s.getEnergyConsumedKWh() < 0)
            errors.add("energy_consumed_kWh < 0 or null");

        if (s.getBatteryStart()!=null && (s.getBatteryStart()<0 || s.getBatteryStart()>100))
            errors.add("battery_start out of [0,100]");
        if (s.getBatteryEnd()!=null && (s.getBatteryEnd()<0 || s.getBatteryEnd()>100))
            errors.add("battery_end out of [0,100]");
        if (s.getBatteryStart()!=null && s.getBatteryEnd()!=null && s.getBatteryEnd() < s.getBatteryStart())
            errors.add("battery_end < battery_start");

        if (s.getStationId()==null || s.getStationId().isBlank())
            errors.add("station_id is null/blank");

        if (s.getLatitude()!=null && (s.getLatitude()< -90 || s.getLatitude()>90))
            errors.add("latitude out of range");
        if (s.getLongitude()!=null && (s.getLongitude()< -180 || s.getLongitude()>180))
            errors.add("longitude out of range");

        return errors;
    }
}