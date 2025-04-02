package com.senior.project.backend.portfolio.dto;

import com.senior.project.backend.domain.YearLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AdminEditYearDTO {
    private UUID userId;
    private YearLevel year;
}
