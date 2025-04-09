package com.senior.project.backend.event;

import lombok.Getter;

@Getter
public class LocalistEventsResponse {
    private LocalistEventItemResponse[] events;
    private LocalistPaginationDTO page;
}
