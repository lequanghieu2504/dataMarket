package com.example.datasetapi.ingest;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;

public class HttpUrlStreamSource implements InputStreamSource {
    private final String url;
    public HttpUrlStreamSource(String url) { this.url = url; }

    @Override public InputStream open() throws IOException {
        URLConnection conn = new URL(url).openConnection();
        conn.setConnectTimeout(15000);
        conn.setReadTimeout(60000);
        return conn.getInputStream();
    }
    @Override public String displayName() { return url; }
}
