package com.example.datasetapi.util;


import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

public final class TimeParser {
    private TimeParser(){}

    private static final DateTimeFormatter[] CANDIDATES = new DateTimeFormatter[]{
            DateTimeFormatter.ISO_OFFSET_DATE_TIME,     // 2025-09-26T10:15:00+07:00
            DateTimeFormatter.ISO_LOCAL_DATE_TIME,      // 2025-09-26T10:15:00
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
    };

    public static LocalDateTime parseFlexible(String s) {
        if (s == null || s.isBlank()) return null;
        for (DateTimeFormatter f : CANDIDATES) {
            try {
                if (f == DateTimeFormatter.ISO_OFFSET_DATE_TIME) {
                    return OffsetDateTime.parse(s, f).toLocalDateTime();
                }
                return LocalDateTime.parse(s, f);
            } catch (Exception ignored) {}
        }
        throw new IllegalArgumentException("Invalid datetime: " + s);
    }
}