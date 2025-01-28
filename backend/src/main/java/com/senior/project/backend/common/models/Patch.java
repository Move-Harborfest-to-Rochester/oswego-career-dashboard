package com.senior.project.backend.common.models;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Patch<TData> {
    private List<PatchOperation<TData>> operations = new ArrayList<>();
}