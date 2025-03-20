package com.senior.project.backend.domain;

import com.senior.project.backend.basacoffice.dto.BasacOfficeFacultyDTO;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class BasacOfficeFaculty {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter
    private UUID id;

    @Setter
    private String name;
    @Setter
    private String title;
    @Setter
    private String email;

    public BasacOfficeFacultyDTO toDTO() {
        return BasacOfficeFacultyDTO.builder()
                .id(id)
                .name(name)
                .title(title)
                .email(email)
                .build();
    }
}
