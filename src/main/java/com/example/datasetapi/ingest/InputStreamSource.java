package com.example.datasetapi.ingest;

import java.io.IOException;
import java.io.InputStream;

public interface InputStreamSource {
    InputStream open() throws IOException;
    String displayName();
}
