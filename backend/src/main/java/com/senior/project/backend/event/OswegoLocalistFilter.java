package com.senior.project.backend.event;

import lombok.Getter;

@Getter
public enum OswegoLocalistFilter {
    CAMPUS_AND_COMMUNITY(125978),
    CAREER_DEVELOPMENT(34680189492342L),
    ALUMNI(125980),
    WORKSHOPS_AND_SEMINARS(125968);

    private final long typeId;

    OswegoLocalistFilter(long typeId) {
        this.typeId = typeId;
    }
}
