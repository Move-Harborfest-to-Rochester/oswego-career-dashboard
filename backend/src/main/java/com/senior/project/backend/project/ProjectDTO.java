package com.senior.project.backend.project;

import java.util.Date;
import java.util.UUID;

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
    String name;
    String description;
    Date startDate;
    Date endDate;
}