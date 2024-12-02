package com.senior.project.backend.supportfaculty;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class SupportFacultyHandler {
    private final SupportFacultyService supportFacultyService;

    public SupportFacultyHandler(@Autowired SupportFacultyService supportFacultyService) {
        this.supportFacultyService = supportFacultyService;
    }

    public Mono<ServerResponse> updateBasacOffice(ServerRequest request) {
        // TODO: implement
        return Mono.empty();
    }
}
