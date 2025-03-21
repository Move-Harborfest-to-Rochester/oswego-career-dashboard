package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Event;
import com.senior.project.backend.util.NonBlockingExecutor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    /**
     * Gets all events
     */
    public Flux<Event> all() {
        return NonBlockingExecutor.executeMany(eventRepository::findAll);
    }

    /**
     * Gets the specific events for the homepage
     * TODO implement this
     * A pageNum param will most likely be included in the future
     */
    public Flux<Event> homepage() {
        return NonBlockingExecutor.executeMany(eventRepository::findAll); //same as /events for now
    }
}
