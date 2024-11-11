package com.senior.project.backend.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class ProjectHandler {
    @Autowired
    private ProjectService projectService;

    public Mono<ServerResponse> saveProject(ServerRequest request) {
        return request.bodyToMono(ProjectDTO.class).flatMap(projectService::saveProject).flatMap(project -> ServerResponse.ok().bodyValue(project));
    }
    public Mono<ServerResponse> deleteProject(ServerRequest request){
        UUID id = UUID.fromString(request.pathVariable("id"));
        projectService.deleteProject(id);
        return ServerResponse.noContent().build();
    }
}