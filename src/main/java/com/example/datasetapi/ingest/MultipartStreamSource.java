package com.example.datasetapi.ingest;

import org.springframework.web.multipart.MultipartFile;
import java.io.*;

public class MultipartStreamSource implements InputStreamSource {
    private final MultipartFile file;
    public MultipartStreamSource(MultipartFile file) { this.file = file; }
    @Override public InputStream open() throws IOException { return file.getInputStream(); }
    @Override public String displayName() { return file.getOriginalFilename(); }
}
