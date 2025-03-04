package com.senior.project.backend.Insights;

import com.senior.project.backend.insights.JsonFileService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JsonFileServiceTest {

    @Mock
    private ResourceLoader resourceLoader;  // Mock the ResourceLoader

    @InjectMocks
    private JsonFileService jsonFileService;  // Inject the mocked ResourceLoader into the service

    @Test
    public void testReadJsonFile() throws IOException {
        // Create a sample JSON string to simulate the content of the file
        String jsonContent = "{\"key1\": \"value1\", \"key2\": \"value2\"}";

        // Mock the ResourceLoader to return a fake Resource
        Resource mockResource = Mockito.mock(Resource.class);
        when(resourceLoader.getResource("file:src\\main\\java\\com\\senior\\project\\backend\\insights\\output.json"))
                .thenReturn(mockResource);

        // Mock the InputStream to return the sample JSON content
        when(mockResource.getInputStream()).thenReturn(new ByteArrayInputStream(jsonContent.getBytes()));

        // Call the method to test
        Map<String, Object> result = jsonFileService.readJsonFile();

        // Verify the result
        assertEquals(2, result.size());
        assertEquals("value1", result.get("key1"));
        assertEquals("value2", result.get("key2"));
    }
}