package com.senior.project.backend.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Validator;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class ProjectHandler {
    @Autowired
    private ProjectService projectService;

    @Autowired
    private Validator validator;

    public Mono<ServerResponse> saveProject(ServerRequest request) {
        return request.bodyToMono(ProjectDTO.class)
            .flatMap(this::validate)
            .flatMap(projectService::saveProject)
            .flatMap(project -> ServerResponse.ok().bodyValue(project));
    }

    private Mono<ProjectDTO> validate(ProjectDTO projectDTO) {
        return Mono.just(validator.validate(projectDTO))
            .flatMap(violations -> {
                if (violations.isEmpty()) {
                    return Mono.just(projectDTO);
                } else {
                    System.out.println("Bad request. Violations: " + violations);
                    return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad Request"));
                }
            });
    }

    public Mono<ServerResponse> deleteProject(ServerRequest request){
        UUID id = UUID.fromString(request.pathVariable("id"));
        projectService.deleteProject(id);
        return ServerResponse.noContent().build();
    }
}