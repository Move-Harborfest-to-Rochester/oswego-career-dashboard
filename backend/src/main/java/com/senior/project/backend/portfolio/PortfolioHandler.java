package com.senior.project.backend.portfolio;

import com.github.fge.jsonpatch.JsonPatch;
import com.senior.project.backend.domain.Interest;
import com.senior.project.backend.domain.Skill;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.portfolio.dto.EditEducationDTO;
import com.senior.project.backend.portfolio.dto.EducationDTO;
import com.senior.project.backend.portfolio.dto.PersonalInfoDTO;

import reactor.core.publisher.Mono;

@Component
public class PortfolioHandler {
    @Autowired
    private PortfolioService portfolioService;

    public Mono<ServerResponse> saveEducation(ServerRequest request) {
        return request.bodyToMono(EditEducationDTO.class)
                .flatMap(portfolioService::saveEducation)
                .flatMap((education) -> ServerResponse.ok().body(Mono.just(education), EducationDTO.class));
    }

    public Mono<ServerResponse> savePersonalInfo(ServerRequest request) {
        return request.bodyToMono(PersonalInfoDTO.class)
                .flatMap(portfolioService::savePersonalInfo)
                .flatMap((personalInfo) -> ServerResponse.ok().bodyValue(personalInfo));
    }


    public Mono<ServerResponse> saveSkills(ServerRequest request) {
        return request.bodyToMono(new ParameterizedTypeReference<ArrayList<Skill>>() {})
            .flatMap(skills -> portfolioService.saveSkills(skills))
            .flatMap(studentDetails -> ServerResponse.ok().bodyValue(studentDetails));
    }


    public Mono<ServerResponse> saveInterest(ServerRequest request) {
        return request.bodyToMono(new ParameterizedTypeReference<ArrayList<Interest>>() {})
                .flatMap(interests ->  portfolioService.saveInterests(interests))
            .flatMap(studentDetails -> ServerResponse.ok().bodyValue(studentDetails));
    }

}
