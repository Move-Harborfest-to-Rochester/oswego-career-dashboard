package com.senior.project.backend.project;

import static org.springframework.web.reactive.function.server.RequestPredicates.*;
import static org.springframework.web.reactive.function.server.RouterFunctions.*;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.util.Endpoints;

@Component
@Configuration
public class ProjectRouter {
    @Bean
    RouterFunction<ServerResponse> projectRoutes(ProjectHandler projectHandler) {
        return route(PUT(Endpoints.PROJECTS.uri()), projectHandler::saveProject)
                .andRoute(DELETE(Endpoints.PROJECT_ID.uri()), projectHandler::deleteProject);
    }
}