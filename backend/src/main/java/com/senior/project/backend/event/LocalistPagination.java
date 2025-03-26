package com.senior.project.backend.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public class LocalistPagination {
    private int page;
    @Getter
    private int limit;

    public int getPage() {
        return page + 1;
    }

    public enum Params {
        PAGE("page"),
        LIMIT("pp");

        private final String key;

        Params(String key) {
            this.key = key;
        }

        public String key() {
            return key;
        }
    }
}
