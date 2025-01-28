package com.senior.project.backend.clubs;


import static org.springframework.web.reactive.function.server.RequestPredicates.DELETE;
import static org.springframework.web.reactive.function.server.RequestPredicates.PUT;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

import com.senior.project.backend.util.Endpoints;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class ClubRouter {

  @Bean
  RouterFunction<ServerResponse> clubRoutes(ClubHandler clubHandler){
    return route(PUT(Endpoints.CLUBS.uri()), clubHandler::saveClub)
            .andRoute(DELETE(Endpoints.CLUBS_ID.uri()), clubHandler::deleteClub);
  }
}
