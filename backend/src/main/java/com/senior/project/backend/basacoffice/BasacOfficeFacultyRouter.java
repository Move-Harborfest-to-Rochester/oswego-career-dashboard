package com.senior.project.backend.basacoffice;

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
public class BasacOfficeFacultyRouter {
    @Bean
    RouterFunction<ServerResponse> basacOfficeFacultyRoutes(BasacOfficeFacultyHandler basacOfficeFacultyHandler) {
        return route(PATCH(Endpoints.BASAC_OFFICE_FACULTY.uri()), basacOfficeFacultyHandler::updateBasacOffice)
                .andRoute(GET(Endpoints.BASAC_OFFICE_FACULTY.uri()), basacOfficeFacultyHandler::getAllBasacOfficeFaculty);
    }
}