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

import com.senior.project.backend.domain.User;
import com.senior.project.backend.domain.YearLevel;
import com.senior.project.backend.portfolio.dto.EducationDTO;
import com.senior.project.backend.util.Endpoints;

import reactor.core.publisher.Mono;

@ExtendWith(MockitoExtension.class)
public class PortfolioHandlerTest {
    private WebTestClient webTestClient;

    @InjectMocks
    private PortfolioHandler portfolioHandler;

    @Mock
    private PortfolioService portfolioService;

    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(new PortfolioRouter().portfolioRoutes(portfolioHandler)).build();
    }

    @Test
    public void testSaveEducationSuccess() {
        when(portfolioService.saveEducation(any(EducationDTO.class))).thenReturn(Mono.just(new User())); // Mock the service call

        webTestClient.put()
                .uri(Endpoints.EDUCATION.uri())
                .body(
                    Mono.just(
                        EducationDTO.builder()
                            .universityId(1)
                            .year(YearLevel.Freshman)
                            .gpa(3.5)
                            .build()
                    ),
                    EducationDTO.class
                )
                .exchange()
                .expectStatus().isNoContent();

        verify(portfolioService, times(1)).saveEducation(any(EducationDTO.class));
    }
}
