package com.senior.project.backend.portfolio;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Generated
public class JobDTO {
    String name;
    String description;
    String location;
    Date startDate;
    Date endDate;
    boolean isCoop;
}
