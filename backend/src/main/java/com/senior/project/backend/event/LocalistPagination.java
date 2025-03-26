package com.senior.project.backend.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public class LocalistPagination {
    private int page;
    @Getter
    private int limit;

    public LocalistPagination() {
        this.page = 0;
        this.limit = 100;
    }

    public int getPage() {
        return page + 1;
    }

    public enum Params {
        PAGE("page"),
        LIMIT("limit");

        private final String key;

        Params(String key) {
            this.key = key;
        }

        public String key() {
            return key;
        }
    }
}
