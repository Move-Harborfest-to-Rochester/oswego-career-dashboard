package com.senior.project.backend.job;

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
public class JobRouter {
    @Bean
    RouterFunction<ServerResponse> jobRoutes(JobHandler jobHandler) {
        return route(PUT(Endpoints.JOBS.uri()), jobHandler::saveJob);
    }
}
