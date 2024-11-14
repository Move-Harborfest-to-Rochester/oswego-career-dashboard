package com.senior.project.backend.portfolio.dto;

import java.util.List;

import com.senior.project.backend.domain.DegreeProgram;
import com.senior.project.backend.domain.YearLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EducationDTO {
    public int universityId;
    public YearLevel year;
    public double gpa;
    public List<DegreeProgram> minors;
    public List<DegreeProgram> majors;
}
