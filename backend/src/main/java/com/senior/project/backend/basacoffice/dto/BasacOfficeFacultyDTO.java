package com.senior.project.backend.basacoffice.dto;

import com.senior.project.backend.domain.BasacOfficeFaculty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BasacOfficeFacultyDTO {
    public UUID id;
    public String name;
    public String title;
    public String email;

    public BasacOfficeFaculty toDomain() {
        return BasacOfficeFaculty.builder()
                .id(id)
                .name(name)
                .title(title)
                .email(email)
                .build();
    }
}