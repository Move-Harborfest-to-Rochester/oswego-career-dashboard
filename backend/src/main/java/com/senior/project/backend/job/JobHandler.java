package com.senior.project.backend.job;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Validator;
import reactor.core.publisher.Mono;

@Component
public class JobHandler {
    @Autowired
    private JobService jobService;

    @Autowired
    private Validator validator;

    private Mono<JobDTO> validate(JobDTO jobDTO) {
        return Mono.just(validator.validate(jobDTO))
            .flatMap(violations -> {
                if (violations.isEmpty()) {
                    return Mono.just(jobDTO);
                } else {
                    System.out.println("Bad request. Violations: " + violations);
                    return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad Request"));
                }
            });
    }

    public Mono<ServerResponse> saveJob(ServerRequest request) {
        return request.bodyToMono(JobDTO.class)
            .flatMap(this::validate)
            .flatMap(jobService::saveJob)
            .flatMap(job -> ServerResponse.ok().bodyValue(job));
    }

    public Mono<ServerResponse> deleteJob(ServerRequest request) {
        UUID id = UUID.fromString(request.pathVariable("id"));
        jobService.deleteJob(id);
        return ServerResponse.noContent().build();
    }
}
