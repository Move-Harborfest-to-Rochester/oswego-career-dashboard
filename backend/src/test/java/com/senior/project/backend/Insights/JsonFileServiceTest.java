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
    private ResourceLoader resourceLoader;

    @InjectMocks
    private JsonFileService jsonFileService;

    @Test
    public void testReadJsonFile() throws IOException {
        String jsonContent = "{\"key1\": \"value1\", \"key2\": \"value2\"}";

        Resource mockResource = Mockito.mock(Resource.class);
        when(resourceLoader.getResource("file:src\\main\\java\\com\\senior\\project\\backend\\insights\\output.json"))
                .thenReturn(mockResource);

        when(mockResource.getInputStream()).thenReturn(new ByteArrayInputStream(jsonContent.getBytes()));

        Map<String, Object> result = jsonFileService.readJsonFile();

        assertEquals(2, result.size());
        assertEquals("value1", result.get("key1"));
        assertEquals("value2", result.get("key2"));
    }
}