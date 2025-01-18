package com.senior.project.backend.basacoffice;

import com.github.fge.jsonpatch.JsonPatch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class BasacOfficeFacultyHandler {
    private final BasacOfficeFacultyService basacOfficeFacultyService;

    public BasacOfficeFacultyHandler(@Autowired BasacOfficeFacultyService supportFacultyService) {
        this.basacOfficeFacultyService = supportFacultyService;
    }

    public Mono<ServerResponse> getAllBasacOfficeFaculty(ServerRequest request) {
        return ServerResponse.ok().bodyValue(basacOfficeFacultyService.getAllBasacOfficeFaculty());
    }

    public Mono<ServerResponse> updateBasacOffice(ServerRequest request) {
        return request.bodyToMono(JsonPatch.class)
                .flatMap(basacOfficeFacultyService::patchBasacOffice)
                .flatMap((basacOfficeFaculty) -> ServerResponse.ok().bodyValue(basacOfficeFaculty));
    }
}