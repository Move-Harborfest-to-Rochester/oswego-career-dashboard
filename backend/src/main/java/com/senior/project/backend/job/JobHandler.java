package com.senior.project.backend.job;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import reactor.core.publisher.Mono;

@Component
public class JobHandler {
    @Autowired
    private JobService jobService;

    public Mono<ServerResponse> saveJob(ServerRequest request) {
        return request.bodyToMono(JobDTO.class).flatMap(jobService::saveJob).flatMap(job -> ServerResponse.ok().bodyValue(job));
    }
}