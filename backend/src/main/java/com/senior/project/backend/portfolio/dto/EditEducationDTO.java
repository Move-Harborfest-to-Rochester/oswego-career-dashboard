package com.senior.project.backend.portfolio.dto;

import java.util.List;

import com.senior.project.backend.domain.YearLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;

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
}