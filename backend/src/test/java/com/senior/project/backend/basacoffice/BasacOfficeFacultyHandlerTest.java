package com.senior.project.backend.basacoffice;

import com.senior.project.backend.basacoffice.dto.BasacOfficeFacultyDTO;
import com.senior.project.backend.common.models.Patch;
import com.senior.project.backend.domain.BasacOfficeFaculty;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BasacOfficeFacultyHandlerTest {

  private WebTestClient webTestClient;

  @InjectMocks
  private BasacOfficeFacultyHandler handler;

  @Mock
  private BasacOfficeFacultyService basacOfficeFacultyService;

  @BeforeEach
  public void setup() {
    // Bind the handler endpoints:
    webTestClient = WebTestClient.bindToRouterFunction(
        RouterFunctions.route()
            .GET("/faculty", handler::getAllBasacOfficeFaculty)
            .PUT("/faculty", handler::updateBasacOffice)
            .build()
    ).build();
  }

  @Test
  public void testGetAllBasacOfficeFaculty() {
    // Create two dummy BasacOfficeFaculty objects.
    BasacOfficeFaculty faculty1 = BasacOfficeFaculty.builder()
        .id(UUID.fromString("e8905f69-e656-4356-9926-661b9e48fcef"))
        .name("Faculty One")
        .build();
    BasacOfficeFaculty faculty2 = BasacOfficeFaculty.builder()
        .id(UUID.fromString("0dd540a4-e4dd-475c-a06d-1463545b34e8"))
        .name("Faculty Two")
        .build();

    when(basacOfficeFacultyService.getAllBasacOfficeFaculty())
        .thenReturn(Flux.just(faculty1, faculty2));

    // Because the handler returns the service data as JSON, we assert on the JSON content.
    webTestClient.get().uri("/faculty")
        .accept(MediaType.APPLICATION_JSON)
        .exchange()
        .expectStatus().isOk()
        // Parse response as list of maps
        .expectBodyList(Map.class)
        .consumeWith(response -> {
          List<Map> list = response.getResponseBody();
          assertTrue(list != null && list.size() == 2, "Expected two items in the list");
          boolean foundOne = list.stream().anyMatch(m -> "Faculty One".equals(m.get("name")));
          boolean foundTwo = list.stream().anyMatch(m -> "Faculty Two".equals(m.get("name")));
          assertTrue(foundOne && foundTwo, "Expected both faculty names to be present");
        });
  }

  @Test
  public void testUpdateBasacOfficeSuccess() {
    // Build a dummy patch request payload as a Map (simulating a Patch<BasacOfficeFacultyDTO>).
    Map<String, Object> dto = new HashMap<>();
    dto.put("id", "e8905f69-e656-4356-9926-661b9e48fcef");
    dto.put("name", "Updated Faculty");
    Map<String, Object> patchBody = new HashMap<>();
    patchBody.put("data", dto);

    // Create a dummy BasacOfficeFaculty that the service returns.
    BasacOfficeFaculty faculty = BasacOfficeFaculty.builder()
        .id(UUID.fromString("e8905f69-e656-4356-9926-661b9e48fcef"))
        .name("Updated Faculty")
        .build();

    when(basacOfficeFacultyService.patchBasacOffice(any(Patch.class)))
        .thenReturn(Flux.just(faculty));

    webTestClient.put().uri("/faculty")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(patchBody)
        .exchange()
        .expectStatus().isOk()
        // The handler builds the response using BasacOfficeFacultyDTO so we can assert on the JSON field.
        .expectBody()
        .jsonPath("$[0].name").isEqualTo("Updated Faculty");
  }

  @Test
  public void testUpdateBasacOfficeInternalServerError() {
    // Build a dummy patch request payload.
    Map<String, Object> dto = new HashMap<>();
    dto.put("id", "e8905f69-e656-4356-9926-661b9e48fcef");
    dto.put("name", "Faulty Faculty");
    Map<String, Object> patchBody = new HashMap<>();
    patchBody.put("data", dto);

    // Simulate the service throwing a RuntimeException (non-IllegalArgumentException).
    when(basacOfficeFacultyService.patchBasacOffice(any(Patch.class)))
        .thenReturn(Flux.error(new RuntimeException("Server error")));

    webTestClient.put().uri("/faculty")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(patchBody)
        .exchange()
        .expectStatus().isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
