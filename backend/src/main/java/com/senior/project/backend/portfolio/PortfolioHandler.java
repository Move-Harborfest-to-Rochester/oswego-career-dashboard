package com.senior.project.backend.portfolio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import reactor.core.publisher.Mono;

@Component
public class PortfolioHandler {
    @Autowired
    private PortfolioService portfolioService;

    public Mono<ServerResponse> saveJob(ServerRequest request) {
        return request.bodyToMono(JobDTO.class).flatMap(portfolioService::saveJob).flatMap(job -> ServerResponse.ok().bodyValue(job));
    }
}
