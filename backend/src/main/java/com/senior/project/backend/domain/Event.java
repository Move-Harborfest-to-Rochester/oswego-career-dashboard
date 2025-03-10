package com.senior.project.backend.domain;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Getter
@Setter
@Entity
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
    private String location;
    private String organizer;
    private boolean isRecurring;
    private String eventLink;
    private String buttonLabel;
    @Nullable
    @Column(nullable = true)
    private Long imageId;

    // Used in Email Template
    public String formattedDate() {
        // Format the date
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
                .format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
    }
}
