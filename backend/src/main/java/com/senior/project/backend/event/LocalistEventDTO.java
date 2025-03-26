package com.senior.project.backend.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.senior.project.backend.domain.Event;
import lombok.Getter;

import java.util.Date;

@Getter
public class LocalistEventDTO {
    private Long id;
    private String title;
    private String location;
    @JsonProperty("localist_url")
    private String url;
    @JsonProperty("first_date")
    private Date firstDate;
    private boolean recurring;
    @JsonProperty("photo_url")
    private String photoUrl;
    @JsonProperty("description_text")
    private String description;

    public Event toEvent() {
        Event event = new Event();
        event.setId(id);
        event.setName(title);
        event.setLocation(location);
        event.setEventLink(url);
        event.setDate(firstDate);
        event.setRecurring(recurring);
        event.setPhotoUrl(photoUrl);
        event.setDescription(description);
        event.setButtonLabel("Learn More");
        return event;
    }
}
