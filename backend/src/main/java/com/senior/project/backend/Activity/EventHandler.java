package com.senior.project.backend.Activity;

import com.senior.project.backend.event.AllEventsResponse;
import com.senior.project.backend.event.EventFilters;
import com.senior.project.backend.event.LocalistPagination;
import com.senior.project.backend.event.LocalistService;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;

@Component
public class EventHandler {

    private final LocalistService localistService;

    public EventHandler(LocalistService localistService) {
        this.localistService = localistService;
    }

    private static Date parseUnixTimestamp(String unixStartDate) {
        Instant instant = Instant.ofEpochMilli(Long.parseLong(unixStartDate));
        return Date.from(instant);
    }

    /**
     * Retrieves all events
     */
    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        String eventName = serverRequest.queryParam("name").filter(s -> !s.isEmpty()).orElse(null);
        int page = Integer.parseInt(serverRequest.queryParam("page").orElse("0"));
        int limit = Integer.parseInt(serverRequest.queryParam("limit").orElse("100"));
        Optional<Date> startDate = serverRequest.queryParam("startDate").map(EventHandler::parseUnixTimestamp);
        Optional<Date> endDate = serverRequest.queryParam("endDate").map(EventHandler::parseUnixTimestamp);
        EventFilters filters = EventFilters
                .builder()
                .eventName(eventName)
                .startDate(startDate.orElse(null))
                .endDate(endDate.orElse(null))
                .build();
        Mono<AllEventsResponse> events = this.localistService.all(filters, new LocalistPagination(page, limit));
        return ServerResponse.ok().body(events, AllEventsResponse.class);
    }

    /**
     * Retrieves the selection of events displayed on the homepage, paginated
     * Not implemented completely yet, so this functions the same as /events
     */
    public Mono<ServerResponse> homepage(ServerRequest serverRequest) {
        return all(ServerRequest
                .from(serverRequest)
                .attribute("limit", "3")
                .build());
    }

    public Mono<ServerResponse> getById(ServerRequest serverRequest) {
        return Mono.just(serverRequest.pathVariable("id"))
                .map(Long::parseLong)
                .flatMap(localistService::findById)
                .flatMap(event -> ServerResponse.ok().bodyValue(event));
    }
}
