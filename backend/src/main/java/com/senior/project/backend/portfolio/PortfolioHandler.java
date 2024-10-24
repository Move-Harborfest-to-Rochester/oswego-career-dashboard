package com.senior.project.backend.portfolio;

import com.github.fge.jsonpatch.JsonPatch;
import com.senior.project.backend.domain.Skill;
import com.senior.project.backend.portfolio.dto.SkillDTO;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.portfolio.dto.EducationDTO;

import reactor.core.publisher.Mono;

@Component
public class PortfolioHandler {
    @Autowired
    private PortfolioService portfolioService;

    public Mono<ServerResponse> saveEducation(ServerRequest request) {
        return request.bodyToMono(EducationDTO.class)
                .flatMap(portfolioService::saveEducation)
                .flatMap(user -> ServerResponse.ok().bodyValue(user));
    }

    public Mono<ServerResponse> editSkills(ServerRequest request) {
        UUID studentId = UUID.fromString(request.pathVariable("studentDetailsID"));
        return request.bodyToMono(JsonPatch.class)
            .flatMap(patch -> portfolioService.patchStudentDetails(studentId, patch))
            .flatMap(updatedStudent -> ServerResponse.ok().bodyValue(updatedStudent))
            .onErrorResume(e -> ServerResponse.badRequest().bodyValue("Invalid Patch Request: " + e.getMessage()));
    }


}
