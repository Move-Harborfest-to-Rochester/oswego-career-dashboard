package com.senior.project.backend.Activity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EventTrackingHandlerTest {

    @InjectMocks
    private EventTrackingHandler eventTrackingHandler;

    @Mock
    private EventTrackingService eventTrackingService;

    private WebTestClient webTestClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UUID testUserId = UUID.randomUUID();
    private final Long testEventId = 1L;

    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(RouterFunctions.route()
                        .GET("/api/event-tracking", eventTrackingHandler::getInterestStatus)
                        .POST("/api/event-tracking/save", eventTrackingHandler::save)
                        .build())
                .build();
    }

    @Test
    public void testGetInterestStatus() {
        // Setup mock response for getInterest
        when(eventTrackingService.getInterest(anyLong(), any(byte[].class))).thenReturn(Mono.just(true));

        // Perform the GET request
        Map result = webTestClient.method(HttpMethod.GET)
                .uri("/api/event-tracking?eventId=" + testEventId + "&userId=" + testUserId)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Map.class)
                .returnResult()
                .getResponseBody();

        // Verify the response
        assertNotNull(result);
        assertEquals(true, result.get("success"));
        assertEquals(true, result.get("isInterested"));
    }

    @Test
    public void testGetInterestStatusFalse() {
        // Setup mock response for getInterest
        when(eventTrackingService.getInterest(anyLong(), any(byte[].class))).thenReturn(Mono.just(false));

        // Perform the GET request
        Map result = webTestClient.method(HttpMethod.GET)
                .uri("/api/event-tracking?eventId=" + testEventId + "&userId=" + testUserId)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Map.class)
                .returnResult()
                .getResponseBody();

        // Verify the response
        assertNotNull(result);
        assertEquals(true, result.get("success"));
        assertEquals(false, result.get("isInterested"));
    }

    @Test
    public void testSaveEventTracking() throws JsonProcessingException {
        // Create test request payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventId", testEventId);
        payload.put("userId", testUserId.toString());
        payload.put("isInterested", true);
        String requestBody = objectMapper.writeValueAsString(payload);

        // Setup mock response
        when(eventTrackingService.saveOrUpdate(anyLong(), any(byte[].class), anyBoolean())).thenReturn(Mono.just(true));

        // Perform the POST request
        Map result = webTestClient.method(HttpMethod.POST)
                .uri("/api/event-tracking/save")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(requestBody)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Map.class)
                .returnResult()
                .getResponseBody();

        // Verify the response
        assertNotNull(result);
        assertEquals(true, result.get("success"));
        assertEquals("Event tracking updated successfully", result.get("message"));
        assertEquals(true, result.get("isInterested"));
    }

    @Test
    public void testSaveEventTrackingFalse() throws JsonProcessingException {
        // Create test request payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventId", testEventId);
        payload.put("userId", testUserId.toString());
        payload.put("isInterested", false);
        String requestBody = objectMapper.writeValueAsString(payload);

        // Setup mock response
        when(eventTrackingService.saveOrUpdate(anyLong(), any(byte[].class), anyBoolean())).thenReturn(Mono.just(true));

        // Perform the POST request
        Map result = webTestClient.method(HttpMethod.POST)
                .uri("/api/event-tracking/save")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(requestBody)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Map.class)
                .returnResult()
                .getResponseBody();

        // Verify the response
        assertNotNull(result);
        assertEquals(true, result.get("success"));
        assertEquals("Event tracking updated successfully", result.get("message"));
        assertEquals(false, result.get("isInterested"));
    }

}