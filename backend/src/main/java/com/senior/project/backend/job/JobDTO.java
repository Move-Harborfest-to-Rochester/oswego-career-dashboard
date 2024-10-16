package com.senior.project.backend.job;

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
public class JobDTO {
    UUID id;
    String name;
    String description;
    String location;
    Date startDate;
    Date endDate;
    boolean isCoop;
}
