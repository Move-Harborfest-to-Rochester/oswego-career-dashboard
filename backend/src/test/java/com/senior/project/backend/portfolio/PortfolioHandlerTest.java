package com.senior.project.backend.portfolio;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.reactive.server.WebTestClient;

import com.senior.project.backend.domain.YearLevel;
import com.senior.project.backend.portfolio.dto.EditEducationDTO;
import com.senior.project.backend.portfolio.dto.EducationDTO;
import com.senior.project.backend.portfolio.dto.PersonalInfoDTO;
import com.senior.project.backend.util.Endpoints;

import reactor.core.publisher.Mono;

@ExtendWith(MockitoExtension.class)
public class PortfolioHandlerTest {
    private WebTestClient webTestClient;

    @InjectMocks
    private PortfolioHandler portfolioHandler;

    @Mock
    private PortfolioService portfolioService;

    @Test
    public void testSavePersonalInfo() {
        when(portfolioService.savePersonalInfo(any(PersonalInfoDTO.class))).thenReturn(Mono.just(new PersonalInfoDTO()));

        webTestClient.patch()
                .uri(Endpoints.PERSONAL_INFO.uri())
                .bodyValue(new PersonalInfoDTO())
                .exchange()
                .expectStatus().isOk();
    }

    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(new PortfolioRouter().portfolioRoutes(portfolioHandler)).build();
    }

    @Test
    public void testSaveEducationSuccess() {
        when(portfolioService.saveEducation(any(EditEducationDTO.class))).thenReturn(Mono.just(new EducationDTO()));

        webTestClient.put()
                .uri(Endpoints.EDUCATION.uri())
                .body(
                    Mono.just(
                        EditEducationDTO.builder()
                            .universityId(1)
                            .year(YearLevel.Freshman)
                            .gpa(3.5)
                            .build()
                    ),
                    EditEducationDTO.class
                )
                .exchange()
                .expectStatus().isOk()
                .expectBody(EducationDTO.class);

        verify(portfolioService, times(1)).saveEducation(any(EditEducationDTO.class));
    }
}
