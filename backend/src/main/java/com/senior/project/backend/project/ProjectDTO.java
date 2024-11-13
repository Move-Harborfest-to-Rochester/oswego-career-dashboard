package com.senior.project.backend.project;

import java.util.Date;
import java.util.UUID;

import com.senior.project.backend.validation.PastOrPresentDate;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Generated
public class ProjectDTO {
    UUID id;
    @NotNull(message = "name is required.")
    String name;
    @NotNull(message = "description is required.")
    String description;
    @NotNull(message = "startDate is required.")
    @PastOrPresentDate(message = "startDate must not be in the future.")
    Date startDate;
    @PastOrPresentDate(message = "endDate must not be in the future.")
    Date endDate;

    @AssertTrue(message = "startDate must be before endDate.")
    public boolean isStartDateBeforeEndDate() {
        return endDate == null || startDate == null || startDate.before(endDate);
    }
}