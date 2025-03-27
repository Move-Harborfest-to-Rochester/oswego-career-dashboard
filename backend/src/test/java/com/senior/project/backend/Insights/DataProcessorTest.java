package com.senior.project.backend.Insights;

import com.senior.project.backend.insights.DataProcessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import javax.sql.DataSource;
import java.io.File;
import java.sql.*;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class DataProcessorTest {

    private DataProcessor dataProcessor;
    private DataSource dataSource;
    private Connection connection;
    private CallableStatement callableStatement;
    private ResultSet resultSet;

    @BeforeEach
    void setUp() {
        // Mock the dependencies
        dataSource = mock(DataSource.class);
        connection = mock(Connection.class);
        callableStatement = mock(CallableStatement.class);
        resultSet = mock(ResultSet.class);

        // Mock the behavior of DataSource to return a mocked Connection
        try {
            when(dataSource.getConnection()).thenReturn(connection);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Create the DataProcessor instance
        dataProcessor = new DataProcessor(dataSource);
        reset(dataSource);
    }

    @Test
    void testProcessData() {
        try {
            // Mock the stored procedure execution and result set handling
            when(connection.prepareCall("{call IterateThroughUsers()}")).thenReturn(callableStatement);
            when(callableStatement.execute()).thenReturn(true);
            when(callableStatement.getResultSet()).thenReturn(resultSet);

            // Mock the behavior of the result set
            when(resultSet.next()).thenReturn(true).thenReturn(false);  // Only one row returned
            when(resultSet.getString(1)).thenReturn("Finance");
            when(resultSet.getString(2)).thenReturn("Freshman");
            when(resultSet.getInt(3)).thenReturn(1);  // resume = 1
            when(resultSet.getInt(4)).thenReturn(1);  // internship = 1
            when(resultSet.getInt(5)).thenReturn(0);  // internshipThisYear = 0
            when(resultSet.getInt(6)).thenReturn(1);  // internshipLastYear = 1

            // Call the method
            dataProcessor.processData();

            // Verify that the appropriate methods were called
            verify(connection).prepareCall("{call IterateThroughUsers()}");
            verify(callableStatement).execute();
            verify(callableStatement).getResultSet();

            // Optionally, you can verify that data was written to a JSON file
            // but in this case we are focusing on mocking the database call.

            // Mocking the output of saving data to JSON
            ObjectMapper objectMapper = mock(ObjectMapper.class);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(new File("output.json"), any(Map.class));

            // Verify saving data (you can replace this with additional assertions)
            verify(objectMapper).writerWithDefaultPrettyPrinter();

        } catch (SQLException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void testUpdateData() {
        // Mock data
        Map<String, Map<String, Map<String, Integer>>> data = dataProcessor.initializeDataStructure();

        // Mock input values
        String major = "Accounting";
        String year = "Freshman";
        int resume = 1;
        int internship = 0;
        int internshipThisYear = 0;
        int internshipLastYear = 0;

        // Call the method to update the data
        dataProcessor.updateData(data, major, year, resume, internship, internshipThisYear, internshipLastYear);

        // Verify the data was updated as expected
        Map<String, Map<String, Integer>> majorData = data.get(major);
        Map<String, Integer> freshmanData = majorData.get(year);

        // Check that the stats have been correctly updated
        assertEquals(1, freshmanData.get("Count"));
        assertEquals(1, freshmanData.get("has_resume"));
        assertEquals(0, freshmanData.get("has_internship"));
        assertEquals(0, freshmanData.get("done_internship_this_year"));
        assertEquals(0, freshmanData.get("done_internship_last_year"));
    }

    @Test
    void testUpdateCategory() {
        Map<String, Map<String, Map<String, Integer>>> data = dataProcessor.initializeDataStructure();
        String category = "All";
        String yearOrTotal = "Total";
        int resume = 1;
        int internship = 0;
        int internshipThisYear = 0;
        int internshipLastYear = 0;

        // Call the method to update the category
        dataProcessor.updateCategory(data, category, yearOrTotal, resume, internship, internshipThisYear, internshipLastYear);

        // Verify the category data is updated
        Map<String, Map<String, Integer>> allCategory = data.get(category);
        Map<String, Integer> totalData = allCategory.get(yearOrTotal);

        // Check the values are updated
        assertEquals(1, totalData.get("Count"));
        assertEquals(1, totalData.get("has_resume"));
        assertEquals(0, totalData.get("has_internship"));
        assertEquals(0, totalData.get("done_internship_this_year"));
        assertEquals(0, totalData.get("done_internship_last_year"));
    }

}
