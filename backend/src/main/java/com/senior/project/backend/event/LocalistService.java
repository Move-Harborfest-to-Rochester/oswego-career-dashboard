package com.senior.project.backend.event;

import com.senior.project.backend.domain.Event;
import jakarta.annotation.Nullable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;

@Service
public class LocalistService {
    private static String careerEventType = "34680189492342";
    private final WebClient webClient;

    public LocalistService(@Value("${localist.api.url}") String apiUrl) {
        webClient = WebClient.create(apiUrl);
    }

    public Flux<Event> all() {
        return allEventDTOs()
                .map(LocalistEventDTO::toEvent);
    }

    private Flux<LocalistEventDTO> allEventDTOs() {
        return allEventDTOs(null, null);
    }

    private Flux<LocalistEventDTO> allEventDTOs(@Nullable Date start, @Nullable Date end) {
        return this.webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/events")
                        .queryParam("pp", "100")
                        .queryParam("type", careerEventType)
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
        return allEventDTOs(startDate, endDate)
                .map(LocalistEventDTO::toEvent);
    }
}
