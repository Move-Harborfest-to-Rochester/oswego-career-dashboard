package com.senior.project.backend.project;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Date;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;

import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Project;
import com.senior.project.backend.domain.StudentDetails;

import reactor.core.publisher.Mono;

@ExtendWith(MockitoExtension.class)
public class ProjectHandlerTest {
    @InjectMocks
    private ProjectHandler projectHandler;
    @Mock
    private ProjectService ProjectService;

    private WebTestClient web;

    @BeforeEach
    public void setup() {
        web = WebTestClient.bindToRouterFunction(RouterFunctions.route()
                        .PUT("/test/saveProject", projectHandler::saveProject)
                        .build())
                .build();
    }

    @Test
    public void testSaveProjectSuccess() {
        ProjectDTO request = new ProjectDTO();
        request.setName("Test Project");
        request.setLocation("Test Location");
        request.setStartDate(new Date());
        Project project = new Project(
                UUID.randomUUID(),
                request.getName(),
                request.getDescription(),
                request.getStartDate(),
                request.getEndDate(),
                new StudentDetails()
        );
        when(projectService.saveProject(any())).thenReturn(Mono.just(project));

        web.put()
                .uri("/test/saveProject")
                .bodyValue(request)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Project.class);
    }
}