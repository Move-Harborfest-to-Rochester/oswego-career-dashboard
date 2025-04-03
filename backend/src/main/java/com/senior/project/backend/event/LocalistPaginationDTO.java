package com.senior.project.backend.event;

import lombok.Getter;

@Getter
public class LocalistPaginationDTO {
    private int current;
    private int size;
    private int total;
}
