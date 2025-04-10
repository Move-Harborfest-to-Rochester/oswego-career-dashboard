package com.senior.project.backend.Activity;

import com.senior.project.backend.AbstractRouter;
import com.senior.project.backend.util.Endpoints;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RequestPredicates.POST;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;


/**
 * Endpoints for milestone/task/events
 */
@Configuration
public class ActivityRouter extends AbstractRouter {
    @Bean
    public RouterFunction<ServerResponse> activityRoutes(
            EventHandler eventHandler,
            MilestoneHandler milestoneHandler,
            TaskHandler taskHandler
    ) {
        return wrapRoutes(
                route(GET(Endpoints.EVENTS.uri()), eventHandler::all)
                        .andRoute(GET(Endpoints.MILESTONES.uri()), milestoneHandler::all)
                        .andRoute(GET(Endpoints.MILESTONES_COMPLETE.uri()), milestoneHandler::completed)
                        .andRoute(GET(Endpoints.HOMEPAGE_EVENTS.uri()), eventHandler::homepage)
                        .andRoute(GET(Endpoints.HOMEPAGE_TASKS.uri()), taskHandler::homepage)
                        .andRoute(GET(Endpoints.EVENT_BY_ID.uri()), eventHandler::getById)
                        .andRoute(GET(Endpoints.TASKS.uri()), taskHandler::all)
                        .andRoute(GET(Endpoints.TASK_BY_ID.uri()), taskHandler::getById)
                        .andRoute(POST(Endpoints.EDIT_TASK.uri()).
                                and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), taskHandler::update)
                        .andRoute(POST(Endpoints.CREATE_TASK.uri()).
                                and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), taskHandler::create)
                        .andRoute(POST(Endpoints.EDIT_MILESTONE.uri()).
                                and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), milestoneHandler::update)
                        .andRoute(POST(Endpoints.CREATE_MILESTONE.uri()).
                                and(RequestPredicates.accept(MediaType.APPLICATION_JSON)), milestoneHandler::create)
        );
    }
}
