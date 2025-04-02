package com.senior.project.backend.portfolio;

import com.senior.project.backend.util.Endpoints;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.PATCH;
import static org.springframework.web.reactive.function.server.RequestPredicates.PUT;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Component
@Configuration
public class PortfolioRouter {
    @Bean
    RouterFunction<ServerResponse> portfolioRoutes(PortfolioHandler portfolioHandler) {
        return route(PATCH(Endpoints.PERSONAL_INFO.uri()), portfolioHandler::savePersonalInfo)
                .and(route(PUT(Endpoints.EDUCATION.uri()), portfolioHandler::saveEducation))
                .andRoute(PUT(Endpoints.EDIT_SKILLS.uri()), portfolioHandler::saveSkills)
                .andRoute(PUT(Endpoints.EDIT_INTERESTS.uri()), portfolioHandler::saveInterest)
                .andRoute(PATCH(Endpoints.ADMIN_EDIT_YEAR.uri()), portfolioHandler::adminEditYear);
    }
}
