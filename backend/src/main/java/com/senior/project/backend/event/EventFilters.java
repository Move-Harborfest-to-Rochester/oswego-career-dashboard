package com.senior.project.backend.event;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Builder
@Getter
@AllArgsConstructor
public class EventFilters {
    @Nullable
    private Date startDate;
    @Nullable
    private Date endDate;
}
