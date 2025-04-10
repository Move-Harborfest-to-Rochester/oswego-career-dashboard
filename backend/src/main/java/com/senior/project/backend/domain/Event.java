package com.senior.project.backend.domain;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Generated
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Date date;
    private Date endDate;
    private String location;
    private String locationUrl;
    private String organizer;
    private boolean isRecurring;
    private String eventLink;
    private String buttonLabel;
    private String photoUrl;

    // Used in Email Template
    public String formattedDate() {
        // Format the date
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
                .format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
    }
}
