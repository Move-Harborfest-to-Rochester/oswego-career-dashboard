package com.senior.project.backend.insights;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

@Service
public class JsonFileService {

    private final ResourceLoader resourceLoader;

    // Constructor injection
    public JsonFileService(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    public Map<String, Object> readJsonFile() throws IOException {
        // Load the JSON file from the classpath
        Resource resource = resourceLoader.getResource("file:src\\main\\java\\com\\senior\\project\\backend\\insights\\output.json");

        InputStream inputStream = resource.getInputStream();

        // Parse JSON to Map<String, Object> using Jackson
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(inputStream, new TypeReference<Map<String, Object>>() {});
    }
}