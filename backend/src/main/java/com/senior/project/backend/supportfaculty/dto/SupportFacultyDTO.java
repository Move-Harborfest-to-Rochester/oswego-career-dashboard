package com.senior.project.backend.supportfaculty.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportFacultyDTO {
    public String name;
    public String title;
    public String email;
}
