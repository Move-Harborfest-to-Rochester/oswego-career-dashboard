package com.senior.project.backend.basacoffice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BasacOfficeFacultyDTO {
    public String name;
    public String title;
    public String email;
}