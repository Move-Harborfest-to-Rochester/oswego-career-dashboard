package com.senior.project.backend.event;

import com.senior.project.backend.domain.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class AllEventsResponse {
    private List<Event> events;
    private int page;
    private int totalPages;
    private int pageSize;
}
