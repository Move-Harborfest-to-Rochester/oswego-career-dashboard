package com.senior.project.backend.Activity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Task;
import com.senior.project.backend.event.LocalistService;
import com.senior.project.backend.security.CurrentUserUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @InjectMocks
    private TaskService taskService;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private LocalistService localistService;

    @Mock
    private CurrentUserUtil currentUserUtil;

    @Test
    public void testAll() {
        Task task1 = new Task();
        task1.setId(1L);
        Task task2 = new Task();
        task2.setId(2L);
        List<Task> tasks = new ArrayList<>();
        tasks.add(task1);
        tasks.add(task2);

        when(taskRepository.findAll()).thenReturn(tasks);
        Flux<Task> result = taskService.all();
        StepVerifier.create(result).expectNext(task1).expectNext(task2).expectComplete().verify();
    }

    @Test
    public void testHomepage() {
        Task task1 = new Task();
        task1.setId(1L);
        Task task2 = new Task();
        task2.setId(2L);
        Task task3 = new Task();
        task3.setId(2L);
        List<Task> tasks = new ArrayList<>();
        tasks.add(task1);
        tasks.add(task2);
        tasks.add(task3);
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userAdmin));
        when(taskRepository.findTasksToDisplayOnHomepage(any(), any(), any())).thenReturn(tasks);
        Flux<Task> result = taskService.homepage(6);
        StepVerifier.create(result)
                .expectNext(task1).expectNext(task2).expectNext(task3)
                .expectNext(task1).expectNext(task2).expectNext(task3)
                .expectComplete().verify();
    }

    @Test
    public void testGetByID() {
        Task task1 = Constants.task1;
        int taskID = task1.getId().intValue();

        when(taskRepository.findById(task1.getId().longValue())).thenReturn(task1);
        Task result = taskService.findById(taskID).block();
        assert result != null;
        assertEquals(result.getId(), task1.getId());
        assertEquals(result.getName(), task1.getName());
    }

    @Test
    public void testGetByIDNull() {
        Task task1 = Constants.task1;
        int taskID = task1.getId().intValue();
        Task expected = (Task) Mono.empty().block();

        when(taskRepository.findById(task1.getId().longValue())).thenReturn(null);
        Task result = taskService.findById(taskID).block();
        assertEquals(result, expected);
    }

    @Test
    public void testUpdateComment() {
        String updateData = "{\"id\":5," +
                "\"taskType\":\"COMMENT\"," +
                "\"description\":\"new description\"," +
                "\"instructions\":\"Meeting Notes!\"," +
                "\"isRequired\":\"true\"}";

        // don't question it
        Task task1 = Constants.task5;
        task1.setArtifactName("Meeting Notes!");
        task1.setEventId(Constants.e2.getId());
        long taskID = task1.getId();

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<>() {
            });
            when(taskRepository.findById(taskID)).thenReturn(task1);
            when(taskRepository.save(Mockito.any(Task.class)))
                    .thenAnswer(i -> i.getArguments()[0]);

            Task result = taskService.updateTask(taskID, jsonMap).block();
            assert result != null;
            assertEquals(task1.getName(), result.getName());
            assertEquals(task1.getTaskType(), result.getTaskType());
            assertEquals("new description", result.getDescription());
            assertNull(result.getArtifactName());
            assertNull(result.getEventId());

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testUpdateArtifact() {
        String updateData = "{\"id\":1," +
                "\"taskType\":\"ARTIFACT\"," +
                "\"artifactName\":\"Meeting Notes\"," +
                "\"instructions\":\"instructions\"," +
                "\"isRequired\":\"true\"}";

        Task task1 = Constants.task1;
        task1.setEventId(Constants.e2.getId());
        long taskID = task1.getId();

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<>() {
            });
            when(taskRepository.findById(taskID)).thenReturn(task1);
            when(taskRepository.save(Mockito.any(Task.class)))
                    .thenAnswer(i -> i.getArguments()[0]);

            Task result = taskService.updateTask(taskID, jsonMap).block();
            assert result != null;
            assertEquals(task1.getName(), result.getName());
            assertEquals(task1.getTaskType(), result.getTaskType());
            assertEquals(task1.getArtifactName(), result.getArtifactName());
            assertNull(result.getEventId());

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testUpdateEvent() {
        String updateData = "{\"id\":4," +
                "\"taskType\":\"EVENT\"," +
                "\"event\":\"2\"," +
                "\"instructions\":\"instructions\"," +
                "\"isRequired\":\"true\"}";

        Task task1 = Constants.task4;
        task1.setArtifactName("whatever");
        task1.setEventId(null);
        long taskID = task1.getId();

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<>() {
            });
            when(taskRepository.findById(taskID)).thenReturn(task1);
            when(taskRepository.save(Mockito.any(Task.class)))
                    .thenAnswer(i -> i.getArguments()[0]);

            Task result = taskService.updateTask(taskID, jsonMap).block();
            assert result != null;
            assertEquals(task1.getName(), result.getName());
            assertEquals(task1.getTaskType(), result.getTaskType());
            assertEquals(Constants.e2.getId(), result.getEventId());
            assertNull(result.getArtifactName());

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testCreateComment() {
        String updateData = "{\"name\":\"Create linkedin profile\"," +
                "\"taskType\":\"COMMENT\"," +
                "\"yearLevel\":\"Freshman\"," +
                "\"description\":\"new description\"," +
                "\"instructions\":\"Meeting Notes\"," +
                "\"isRequired\":\"true\"}";

        // don't question it
        Task task1 = Constants.task5;

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<>() {
            });
            when(taskRepository.save(Mockito.any(Task.class)))
                    .thenAnswer(i -> i.getArguments()[0]);

            Task result = taskService.createTask(jsonMap).block();
            assert result != null;
            assertEquals(task1.getName(), result.getName());
            assertEquals(task1.getYearLevel(), result.getYearLevel());
            assertEquals(task1.getTaskType(), result.getTaskType());
            assertEquals("new description", result.getDescription());
            assertNull(result.getArtifactName());
            assertNull(result.getEventId());

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testCreateArtifact() {
        String updateData = "{\"name\":\"Major and Class Schedule\"," +
                "\"taskType\":\"ARTIFACT\"," +
                "\"yearLevel\":\"Freshman\"," +
                "\"artifactName\":\"Meeting Notes\"," +
                "\"instructions\":\"instructions\"," +
                "\"isRequired\":\"true\"}";

        // don't question it
        Task task1 = Constants.task1;

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<>() {
            });
            when(taskRepository.save(Mockito.any(Task.class)))
                    .thenAnswer(i -> i.getArguments()[0]);

            Task result = taskService.createTask(jsonMap).block();
            assert result != null;
            assertEquals(task1.getName(), result.getName());
            assertEquals(task1.getYearLevel(), result.getYearLevel());
            assertEquals(task1.getTaskType(), result.getTaskType());
            assertEquals(task1.getArtifactName(), result.getArtifactName());
            assertNull(result.getEventId());

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testCreateEvent() {
        String updateData = "{\"name\":\"Attend Job Fair\"," +
                "\"taskType\":\"EVENT\"," +
                "\"yearLevel\":\"Freshman\"," +
                "\"event\":\"2\"," +
                "\"instructions\":\"instructions\"," +
                "\"isRequired\":\"true\"}";

        Task task1 = Constants.task4;

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMap;
        try {
            jsonMap = objectMapper.readValue(updateData, new TypeReference<>() {
            });
            when(taskRepository.save(Mockito.any(Task.class)))
                    .thenAnswer(i -> i.getArguments()[0]);

            Task result = taskService.createTask(jsonMap).block();
            assert result != null;
            assertEquals(task1.getName(), result.getName());
            assertEquals(task1.getTaskType(), result.getTaskType());
            assertEquals(Constants.e2.getId(), result.getEventId());
            assertNull(result.getArtifactName());

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
