package com.senior.project.backend.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonalInfoDTO {
    private String firstName;
    private String preferredName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String linkedIn;
    private String description;
}
