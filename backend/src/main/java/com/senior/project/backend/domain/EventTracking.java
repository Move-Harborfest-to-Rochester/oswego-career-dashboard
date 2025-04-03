package com.senior.project.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Generated
public class EventTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false, columnDefinition = "BINARY(16)")
    private byte[] userId;

    @Column(nullable = false)
    private boolean isInterested;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreated = new Date();
}
