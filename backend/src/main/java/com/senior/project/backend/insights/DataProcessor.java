package com.senior.project.backend.insights;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import javax.sql.DataSource;
import java.sql.*;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class DataProcessor {

    @Value("${CRD_DB_USERNAME:backend}")
    private String dbUsername;

    @Value("${CRD_DB_PASSWORD}")
    private String dbPassword;

    private final DataSource dataSource;

    public DataProcessor(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void processData() {
        String dbUrl = "jdbc:mysql://localhost:3306/crd";
        try (Connection connection = dataSource.getConnection()) {
            // Call the stored procedure
            CallableStatement statement = connection.prepareCall("{call IterateThroughUsers()}");
            boolean hasResults = statement.execute();

            // Data structure to store results
            var data = initializeDataStructure();

            // Process each row
            while (hasResults) {
                try (ResultSet result = statement.getResultSet()) {
                    while (result.next()) {
                        System.out.println(result.getString(1));
                        String major = result.getString(1);
                        String year = result.getString(2);
                        int resume = result.getInt(3);
                        int internship = result.getInt(4);
                        int internshipThisYear = result.getInt(5);
                        int internshipLastYear = result.getInt(6);

                        if (major == null || year == null) continue;

                        updateData(data, major, year, resume, internship, internshipThisYear, internshipLastYear);
                    }
                }
                hasResults = statement.getMoreResults();
            }

            // Convert data to JSON and save to a file
            saveDataToJson(data);

            System.out.println("Data has been saved to output.json");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void updateData(Map<String, Map<String, Map<String, Integer>>> data, String major, String year, int resume, int internship, int internshipThisYear, int internshipLastYear) {
        // Update 'All' category
        updateCategory(data, "All", "Total", resume, internship, internshipThisYear, internshipLastYear);
        updateCategory(data, "All", year, resume, internship, internshipThisYear, internshipLastYear);

        // Update major-specific categories
        updateCategory(data, major, "Total", resume, internship, internshipThisYear, internshipLastYear);
        updateCategory(data, major, year, resume, internship, internshipThisYear, internshipLastYear);
    }

    private void updateCategory(Map<String, Map<String, Map<String, Integer>>> data, String category, String yearOrTotal, int resume, int internship, int internshipThisYear, int internshipLastYear) {
        // If category does not exist, initialize it
        data.putIfAbsent(category, new HashMap<>());
        data.get(category).putIfAbsent(yearOrTotal, initializeStats());

        // Get the stats for the year/total in the category
        Map<String, Integer> stats = data.get(category).get(yearOrTotal);

        // Update the counts and stats
        stats.put("Count", stats.get("Count") + 1);
        stats.put("has_resume", stats.get("has_resume") + resume);
        stats.put("has_internship", stats.get("has_internship") + internship);
        stats.put("done_internship_this_year", stats.get("done_internship_this_year") + internshipThisYear);
        stats.put("done_internship_last_year", stats.get("done_internship_last_year") + internshipLastYear);
    }


    private void saveDataToJson(Map<String, Map<String, Map<String, Integer>>> data) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // Serialize the data to JSON and save it to a file in the current directory
            File outputFile = new File("src\\main\\java\\com\\senior\\project\\backend\\insights\\output.json");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, data);
            System.out.println("Data has been saved to output.json");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error while saving data to JSON");
        }
    }

    private Map<String, Map<String, Map<String, Integer>>> initializeDataStructure() {
        // Initialize the nested Map structure similar to the 'data' variable in the Python code
        Map<String, Map<String, Map<String, Integer>>> data = new LinkedHashMap<>();

        // Initialize structure for "All"
        data.put("All", initializeYearStats());

        // Initialize structure for each major
        String[] majors = {
                "Accounting", "Business Administration", "Finance", "Human Resource Management",
                "Marketing", "Operations Management and Information Systems", "Risk Management and Insurance"
        };

        for (String major : majors) {
            data.put(major, initializeYearStats());
        }

        return data;
    }

    private Map<String, Map<String, Integer>> initializeYearStats() {
        // Initialize the structure for each year (Total, Freshman, Sophomore, Junior, Senior)
        Map<String, Map<String, Integer>> yearStats = new LinkedHashMap<>();
        String[] years = {"Total", "Freshman", "Sophomore", "Junior", "Senior"};

        for (String year : years) {
            yearStats.put(year, initializeStats());
        }

        return yearStats;
    }

    private Map<String, Integer> initializeStats() {
        // Initialize the default statistics for each year/category
        Map<String, Integer> stats = new LinkedHashMap<>();
        stats.put("Count", 0);
        stats.put("has_resume", 0);
        stats.put("has_internship", 0);
        stats.put("done_internship_this_year", 0);
        stats.put("done_internship_last_year", 0);
        return stats;
    }
}
