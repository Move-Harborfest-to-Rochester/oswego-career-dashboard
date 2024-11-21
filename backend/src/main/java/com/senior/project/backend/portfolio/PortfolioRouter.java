package com.senior.project.backend.portfolio;

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
public class PortfolioRouter {
    @Bean
    RouterFunction<ServerResponse> portfolioRoutes(PortfolioHandler portfolioHandler) {
        return route(PATCH(Endpoints.PERSONAL_INFO.uri()), portfolioHandler::savePersonalInfo)
            .and(route(PUT(Endpoints.EDUCATION.uri()), portfolioHandler::saveEducation))
            .andRoute(PATCH(Endpoints.EDIT_SKILLS.uri()), portfolioHandler::editSkills);
//            .andRoute(PUT(Endpoints.EDIT_INTERESTS.uri()), portfolioHandler::editInterests);
    }
}
