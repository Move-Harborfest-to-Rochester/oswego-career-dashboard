package com.senior.project.backend.event;

import com.senior.project.backend.domain.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
@Builder
public class AllEventsResponse {
    private final List<Event> events;
    private final int page;
    private final int totalPages;
    private final int pageSize;
}
