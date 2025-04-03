package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import com.senior.project.backend.event.AllEventsResponse;
import com.senior.project.backend.event.LocalistService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;
import reactor.core.publisher.Mono;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EventHandlerTest {

    @InjectMocks
    private EventHandler eventHandler;

    @Mock
    private LocalistService localistService;

    private WebTestClient webTestClient;

    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(RouterFunctions.route()
                        .GET("/api/events", eventHandler::all)
                        .GET("/api/homepage_events", eventHandler::homepage)
                        .build())
                .build();
    }

    @Test
    public void testAll() {
        Event event1 = new Event();
        event1.setId(1L);
        Event event2 = new Event();
        event2.setId(2L);
        Mono<AllEventsResponse> events = Mono.just(new AllEventsResponse(List.of(event1, event2), 1, 1, 10));
        when(localistService.all(any(), any())).thenReturn(events);
        AllEventsResponse result = webTestClient.method(HttpMethod.GET)
                .uri("/api/events").exchange().expectStatus().isOk()
                .expectBody(AllEventsResponse.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(2, result.getEvents().size());
        assertEquals(event1.getId(), result.getEvents().get(0).getId());
        assertEquals(event2.getId(), result.getEvents().get(1).getId());
    }

    @Test
    public void testHomepage() {
        //currently this is the same test as /events
        Event event1 = new Event();
        event1.setId(1L);
        Event event2 = new Event();
        event2.setId(2L);
        Event event3 = new Event();
        event3.setId(3L);
        Mono<AllEventsResponse> events = Mono.just(new AllEventsResponse(List.of(event1, event2, event3), 1, 1, 10));
        when(localistService.all(any(), any())).thenReturn(events);
        AllEventsResponse result = webTestClient.method(HttpMethod.GET)
                .uri("/api/homepage_events?pageNum=1").exchange().expectStatus().isOk()
                .expectBody(AllEventsResponse.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(3, result.getEvents().size());
        assertEquals(event1.getId(), result.getEvents().get(0).getId());
        assertEquals(event2.getId(), result.getEvents().get(1).getId());
        assertEquals(event3.getId(), result.getEvents().get(2).getId());
    }
}
