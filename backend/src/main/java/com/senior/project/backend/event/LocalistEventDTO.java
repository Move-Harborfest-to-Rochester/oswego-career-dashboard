package com.senior.project.backend.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.senior.project.backend.domain.Event;
import lombok.Getter;

import java.util.Date;

@Getter
public class LocalistEventDTO {
    private Long id;
    private String title;
    @JsonProperty("location_name")
    private String location;
    @JsonProperty("venue_url")
    private String locationUrl;
    @JsonProperty("localist_url")
    private String url;
    @JsonProperty("first_date")
    private Date firstDate;
    @JsonProperty("last_date")
    private Date lastDate;
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
        event.setLocationUrl(locationUrl);
        event.setEventLink(url);
        event.setDate(firstDate);
        event.setEndDate(lastDate);
        event.setRecurring(recurring);
        event.setPhotoUrl(photoUrl);
        event.setDescription(description);
        event.setButtonLabel("Learn More");
        return event;
    }
}
