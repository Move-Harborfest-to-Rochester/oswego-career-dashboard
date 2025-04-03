package com.senior.project.backend.portfolio.dto;

import com.senior.project.backend.domain.YearLevel;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Generated
public class EditEducationDTO {
    int universityId;
    YearLevel year;
    double gpa;
    List<DegreeProgramOperation> degreeProgramOperations;

    public boolean isNotSettingToAlumni() {
        return this.year != YearLevel.Alumni;
    }
}