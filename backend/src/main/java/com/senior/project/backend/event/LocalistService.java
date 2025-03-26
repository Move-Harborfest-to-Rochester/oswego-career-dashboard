package com.senior.project.backend.event;

import com.senior.project.backend.domain.Event;
import jakarta.annotation.Nullable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.text.SimpleDateFormat;
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

    private static String formatDate(Date date) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        return dateFormat.format(date);
    }

    public Flux<Event> all(@Nullable EventFilters filters, LocalistPagination pagination) {
        Flux<LocalistEventDTO> events;
        if (filters != null) {
            events = allEventDTOs(filters, pagination);
        } else {
            events = allEventDTOs(pagination);
        }
        return events
                .map(LocalistEventDTO::toEvent);
    }

    private Flux<LocalistEventDTO> allEventDTOs(LocalistPagination pagination) {
        return allEventDTOs(null, pagination);
    }

    private UriBuilder addFiltersIfExist(@Nullable EventFilters filters, UriBuilder builder) {
        if (filters != null) {
            builder.queryParamIfPresent("startDate", Optional.ofNullable(filters.getStartDate())
                    .map(LocalistService::formatDate)
            );
            builder.queryParamIfPresent("endDate", Optional.ofNullable(filters.getEndDate())
                    .map(LocalistService::formatDate)
            );
        }
        return builder;
    }

    private Flux<LocalistEventDTO> allEventDTOs(@Nullable EventFilters filters, LocalistPagination pagination) {
        return this.webClient.get()
                .uri(uriBuilder -> addFiltersIfExist(filters, uriBuilder
                        .path("/events")
                        .queryParam(LocalistPagination.Params.LIMIT.key(), pagination.getLimit())
                        .queryParam(LocalistPagination.Params.PAGE.key(), pagination.getPage()))
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
        EventFilters filters = EventFilters
                .builder()
                .startDate(startDate)
                .endDate(endDate)
                .build();
        return allEventDTOs(filters, new LocalistPagination(1, 100))
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
