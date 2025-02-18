package com.senior.project.backend.insights;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final JsonFileService jsonFileService;

    @Autowired
    public StatsController(JsonFileService jsonFileService) {
        this.jsonFileService = jsonFileService;
    }

    @GetMapping
    public Map<String, Object> getAllStats() throws IOException {
        return jsonFileService.readJsonFile();
    }

    @GetMapping("/{key}")
    public Object getStatsByKey(@PathVariable String key) throws IOException {
        Map<String, Object> statsMap = jsonFileService.readJsonFile();
        return statsMap.get(key);
    }
}