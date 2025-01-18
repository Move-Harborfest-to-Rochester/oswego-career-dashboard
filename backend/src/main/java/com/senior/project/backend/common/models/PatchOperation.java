package com.senior.project.backend.common.models;

import lombok.Data;

@Data
public class PatchOperation<TData> {
    private String op;
    private String path;
    private TData value;
}