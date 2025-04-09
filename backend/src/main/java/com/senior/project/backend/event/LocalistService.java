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
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    private List<Long> eventTypesToInclude() {
        return List.of(
                OswegoLocalistFilter.CAREER_DEVELOPMENT.getTypeId()
        );
    }

    public Mono<AllEventsResponse> all(@Nullable EventFilters filters, LocalistPagination pagination) {
        if (filters != null) {
            return allEventDTOs(filters, pagination);
        }
        return allEventDTOs(pagination);
    }

    private Mono<AllEventsResponse> allEventDTOs(LocalistPagination pagination) {
        return allEventDTOs(null, pagination);
    }

    private UriBuilder addFiltersIfExist(@Nullable EventFilters filters, UriBuilder builder) {
        if (filters != null) {
            builder.queryParamIfPresent("start", Optional.ofNullable(filters.getStartDate())
                    .map(LocalistService::formatDate)
            );
            builder.queryParamIfPresent("end", Optional.ofNullable(filters.getEndDate())
                    .map(LocalistService::formatDate)
            );
            if (filters.getEndDate() == null) {
                builder.queryParam("days", 365);
            }
            builder.queryParamIfPresent("search", Optional.ofNullable(filters.getEventName()));
        }
        return builder;
    }

    private Mono<AllEventsResponse> allEventDTOs(@Nullable EventFilters filters, LocalistPagination pagination) {
        return this.webClient.get()
                .uri(uriBuilder -> addFiltersIfExist(filters, uriBuilder
                        .path(eventsApiPath(filters))
                        .queryParam(LocalistPagination.Params.LIMIT.key(), pagination.getLimit())
                        .queryParam(LocalistPagination.Params.PAGE.key(), pagination.getPage()))
                        .queryParam(LocalistPagination.Params.SORT.key(), "date")
                        .queryParam(LocalistPagination.Params.ORDER.key(), "asc")
                        .queryParam("type", eventTypesToInclude())
                        .build())
                .retrieve()
                .bodyToMono(LocalistEventsResponse.class)
                .map(response -> new AllEventsResponse(
                        Arrays.stream(response.getEvents())
                                .map(LocalistEventItemResponse::getEvent)
                                .map(LocalistEventDTO::toEvent)
                                .collect(Collectors.groupingBy(Event::getId))
                                .values().stream()
                                .map(list -> list.get(0))
                                .collect(Collectors.toList()),
                        response.getPage().getCurrent(),
                        response.getPage().getTotal(),
                        response.getPage().getSize()
                ));
    }

    private String eventsApiPath(EventFilters filters) {
        if (filters == null || filters.getEventName() == null) {
            return "/events";
        }
        return "/events/search";
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
                .map(AllEventsResponse::getEvents)
                .flatMapMany(Flux::fromIterable);
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
