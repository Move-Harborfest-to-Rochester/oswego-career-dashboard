package com.senior.project.backend.portfolio;

import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;

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

    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(RouterFunctions.route()
                        .PATCH(Endpoints.PERSONAL_INFO.uri(), portfolioHandler::savePersonalInfo)
                        .build())
                .build();
    }

    @Test
    public void testSavePersonalInfo() {
        when(portfolioService.savePersonalInfo(any(PersonalInfoDTO.class))).thenReturn(Mono.just(new PersonalInfoDTO()));

        webTestClient.patch()
                .uri(Endpoints.PERSONAL_INFO.uri())
                .bodyValue(new PersonalInfoDTO())
                .exchange()
                .expectStatus().isOk();
    }
}
