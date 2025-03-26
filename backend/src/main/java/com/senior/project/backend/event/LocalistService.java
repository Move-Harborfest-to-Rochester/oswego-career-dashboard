package com.senior.project.backend.event;

import com.senior.project.backend.domain.Event;
import jakarta.annotation.Nullable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;

@Service
public class LocalistService {
    private final WebClient webClient;

    public LocalistService(@Value("${localist.api.url}") String apiUrl) {
        webClient = WebClient.create(apiUrl);
    }

    public Flux<Event> all(PaginationRequest pagination) {
        return allEventDTOs(pagination)
                .map(LocalistEventDTO::toEvent);
    }

    private Flux<LocalistEventDTO> allEventDTOs(PaginationRequest pagination) {
        return allEventDTOs(null, null, pagination);
    }

    private Flux<LocalistEventDTO> allEventDTOs(@Nullable Date start, @Nullable Date end, PaginationRequest pagination) {
        return this.webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/events")
                        .queryParam("pp", pagination.getPage())
                        .queryParam("limit", pagination.getLimit())
                        .queryParamIfPresent("start", Optional.ofNullable(start))
                        .queryParamIfPresent("end", Optional.ofNullable(end))
                        .build())
                .retrieve()
                .bodyToMono(LocalistEventsResponse.class)
                .map(LocalistEventsResponse::getEvents)
                .flatMapMany(Flux::fromArray)
                .map(LocalistEventItemResponse::getEvent);
    }

    public Flux<Event> findEventsInCurrentWeek(LocalDate currentDate) {
        LocalDate startOfWeek = currentDate.with(DayOfWeek.SUNDAY);
        LocalDate endOfWeek = currentDate.with(DayOfWeek.SATURDAY);

        Date startDate = Date.from(startOfWeek.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(endOfWeek.atStartOfDay(ZoneId.systemDefault()).toInstant());
        return allEventDTOs(startDate, endDate, new PaginationRequest(1, 100))
                .map(LocalistEventDTO::toEvent);
    }

    public Mono<Event> findById(long eventId) {
        return this.webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/events/" + eventId)
                        .build())
                .retrieve()
                .bodyToMono(LocalistEventItemResponse.class)
                .map(LocalistEventItemResponse::getEvent)
                .map(LocalistEventDTO::toEvent);
    }
}
