package com.senior.project.backend.basacoffice;

import com.senior.project.backend.basacoffice.dto.BasacOfficeFacultyDTO;
import com.senior.project.backend.common.models.Patch;
import com.senior.project.backend.domain.BasacOfficeFaculty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
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
        return ServerResponse.ok().body(basacOfficeFacultyService.getAllBasacOfficeFaculty(), BasacOfficeFaculty.class);
    }

    public Mono<ServerResponse> updateBasacOffice(ServerRequest request) {
        return request.bodyToMono(new ParameterizedTypeReference<Patch<BasacOfficeFacultyDTO>>() {})
                .flatMap(patch -> ServerResponse.ok().body(basacOfficeFacultyService.patchBasacOffice(patch), BasacOfficeFacultyDTO.class))
                .onErrorResume(error -> {
                    if (error instanceof IllegalArgumentException) {
                        return ServerResponse.badRequest().bodyValue(error.getMessage());
                    }
                    return ServerResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                });
    }
}