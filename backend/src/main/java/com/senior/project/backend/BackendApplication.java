package com.senior.project.backend;

import com.senior.project.backend.insights.DataProcessor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
@EnableScheduling
public class BackendApplication implements CommandLineRunner {

    private final DataProcessor dataProcessor;

    public BackendApplication(DataProcessor dataProcessor) {
        this.dataProcessor = dataProcessor;
    }

    public static void main(String[] args) {

        List<String> envVars = Arrays.asList("CRD_DB_PASSWORD", "EMAIL_PASSWORD", "CRD_SUPER_ADMIN");

        List<String> missingVars = new ArrayList<>();
        for (String var : envVars) {
            if (System.getenv(var) == null) {
                missingVars.add(var);
            }
        }

        if (!missingVars.isEmpty()) {
            System.out.println("Required environment variables are not defined: " + missingVars);
            return;
        }
        SpringApplication.run(BackendApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        dataProcessor.processData();
    }
}