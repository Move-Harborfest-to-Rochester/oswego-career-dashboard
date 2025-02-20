package com.senior.project.backend.clubs;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.senior.project.backend.domain.Club;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;
import reactor.core.publisher.Mono;

@ExtendWith(MockitoExtension.class)
public class ClubHandlerTest {

  private WebTestClient webTestClient;

  @InjectMocks
  private ClubHandler clubHandler;

  @Mock
  private ClubService clubService;

  @BeforeEach
  public void setup() {
    // Bind the endpoints:
    webTestClient = WebTestClient.bindToRouterFunction(
        RouterFunctions.route()
            .POST("/club", clubHandler::saveClub)
            .DELETE("/club/{id}", clubHandler::deleteClub)
            .build()
    ).build();
  }

  @Test
  public void testSaveClub() {
    Club club = new Club();
    club.setId(UUID.randomUUID());
    club.setName("Test Club");

    when(clubService.saveClub(any())).thenReturn(Mono.just(club));

    webTestClient.post()
        .uri("/club")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(club)
        .exchange()
        .expectStatus().isOk()
        .expectBody(Club.class)
        .isEqualTo(club);
  }

  @Test
  public void testDeleteClub() {
    // Create a dummy UUID for the club.
    UUID clubId = UUID.randomUUID();
    // Stub clubService.deleteClub to do nothing.
    doNothing().when(clubService).deleteClub(eq(clubId));

    webTestClient.delete()
        .uri("/club/{id}", clubId.toString())
        .exchange()
        .expectStatus().isNoContent();

    verify(clubService).deleteClub(eq(clubId));
  }
}
