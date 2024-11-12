package com.senior.project.backend.job;

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
public class JobDTO {
    UUID id;
    @NotNull(message = "name is required.")
    String name;
    String description;
    @NotNull(message = "location is required.")
    String location;
    @NotNull(message = "startDate is required.")
    @PastOrPresentDate(message = "startDate must not be in the future.")
    Date startDate;
    @PastOrPresentDate(message = "endDate must not be in the future.")
    Date endDate;
    @NotNull(message = "coop is required.")
    boolean coop;

    @AssertTrue(message = "startDate must be before endDate.")
    public boolean isStartDateBeforeEndDate() {
        return endDate == null || startDate == null || startDate.before(endDate);
    }
}
