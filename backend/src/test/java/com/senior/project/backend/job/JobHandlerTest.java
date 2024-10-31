package com.senior.project.backend.job;

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
import com.senior.project.backend.domain.Job;
import com.senior.project.backend.domain.StudentDetails;

import reactor.core.publisher.Mono;

@ExtendWith(MockitoExtension.class)
public class JobHandlerTest {
    @InjectMocks
    private JobHandler jobHandler;
    @Mock
    private JobService jobService;

    private WebTestClient web;

    @BeforeEach
    public void setup() {
        web = WebTestClient.bindToRouterFunction(RouterFunctions.route()
            .PUT("/test/saveJob", jobHandler::saveJob)
            .build())
        .build();
    }

    @Test
    public void testSaveJobSuccess() {
        JobDTO request = new JobDTO();
        request.setName("Test Job");
        request.setDescription("Test Description");
        request.setLocation("Test Location");
        request.setCoop(true);
        request.setStartDate(new Date());
        Job job = new Job(
            UUID.randomUUID(),
            request.getName(),
            request.getDescription(),
            request.getLocation(),
            request.isCoop(),
            request.getStartDate(),
            request.getEndDate(),
            new StudentDetails()
        );
        when(jobService.saveJob(any())).thenReturn(Mono.just(job));

        web.put()
            .uri("/test/saveJob")
            .bodyValue(request)
            .exchange()
            .expectStatus().isOk()
            .expectBody(Job.class);
    }
}