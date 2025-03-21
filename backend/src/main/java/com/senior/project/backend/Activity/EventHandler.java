package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import com.senior.project.backend.event.LocalistService;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class EventHandler {

    private final LocalistService localistService;

    public EventHandler(LocalistService localistService) {
        this.localistService = localistService;
    }

    /**
     * Retrieves all events
     */
    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        return ServerResponse.ok().body(this.localistService.all(), Event.class);
    }

    /**
     * Retrieves the selection of events displayed on the homepage, paginated
     * Not implemented completely yet, so this functions the same as /events
     */
    public Mono<ServerResponse> homepage(ServerRequest serverRequest) {
        serverRequest.queryParam("pageNum");    // TODO pass to homepage() and get paged result
        return ServerResponse.ok().body(this.localistService.all(), Event.class);
    }
}
