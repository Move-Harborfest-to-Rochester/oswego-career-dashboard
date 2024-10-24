package com.senior.project.backend.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import reactor.core.publisher.Mono;

@Component
public class ProjectHandler {
    @Autowired
    private ProjectService projectService;

    public Mono<ServerResponse> saveProject(ServerRequest request) {
        return request.bodyToMono(ProjectDTO.class).flatMap(projectService::saveProject).flatMap(project -> ServerResponse.ok().bodyValue(project));
    }
}