package com.example.datasetapi.csv;

import java.util.List;
import java.util.Set;

public final class Headers {
    private Headers(){}

    public static final List<String> REQUIRED_15 = List.of(
            "session_id","user_id","username","car_brand","car_model",
            "station_id","station_name","location","latitude","longitude",
            "start_time","end_time","battery_start","battery_end","energy_consumed_kWh"
    );

    // Cột quan trọng thiếu ⇒ RED (theo thỏa thuận)
    public static final Set<String> CRITICAL = Set.of(
            "session_id","start_time","end_time","energy_consumed_kWh"
    );

    public static final int EXPECTED_COUNT = REQUIRED_15.size();
}
