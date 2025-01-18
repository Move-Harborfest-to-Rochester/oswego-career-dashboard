package com.senior.project.backend.common.models;

import lombok.Data;

import java.util.UUID;

@Data
public class PatchOperation<TData> {
    private String op;
    private UUID id;
    private TData value;
}