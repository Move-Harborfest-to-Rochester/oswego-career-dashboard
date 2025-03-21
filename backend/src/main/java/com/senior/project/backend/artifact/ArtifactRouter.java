package com.senior.project.backend.artifact;

import com.senior.project.backend.util.Endpoints;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.*;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

/**
 * Endpoints for artifacts
 */
@Component
public class ArtifactRouter {
    @Bean
    public RouterFunction<ServerResponse> artifactRoutes(ArtifactHandler artifactHandler) {
        return route(POST(Endpoints.ARTIFACT.uri()), artifactHandler::handleSubmissionUpload)
                .andRoute(POST(Endpoints.USERS_PROFILE_PICTURE.uri()), artifactHandler::handleProfileImageUpload)
                .andRoute(GET(Endpoints.USERS_PROFILE_PICTURE.uri()), artifactHandler::serveUserProfileImage)
                .andRoute(DELETE(Endpoints.ARTIFACT_ID.uri()), artifactHandler::handleFileDelete)
                .andRoute(GET(Endpoints.ARTIFACT_FILE.uri()), artifactHandler::serveFile)
                .andRoute(GET(Endpoints.IMAGE_EVENT.uri()), artifactHandler::serveFile);
    }
}
