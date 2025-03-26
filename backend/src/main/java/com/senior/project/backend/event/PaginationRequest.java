package com.senior.project.backend.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaginationRequest {
    private int page;
    private int limit;

    public PaginationRequest() {
        this.page = 0;
        this.limit = 100;
    }
}
