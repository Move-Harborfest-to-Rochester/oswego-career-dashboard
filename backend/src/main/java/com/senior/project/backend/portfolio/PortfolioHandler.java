package com.senior.project.backend.portfolio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.portfolio.dto.PersonalInfoDTO;

import reactor.core.publisher.Mono;

@Component
public class PortfolioHandler {
    @Autowired
    private PortfolioService portfolioService;

    public Mono<ServerResponse> savePersonalInfo(ServerRequest request) {
        return request.bodyToMono(PersonalInfoDTO.class)
                .flatMap(portfolioService::savePersonalInfo)
                .flatMap((personalInfo) -> ServerResponse.ok().bodyValue(personalInfo));
    }
}