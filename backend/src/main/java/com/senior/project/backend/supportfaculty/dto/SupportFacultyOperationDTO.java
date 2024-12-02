package com.senior.project.backend.supportfaculty.dto;

import com.senior.project.backend.util.OperationType;
import jakarta.annotation.Nullable;

import java.util.UUID;

public class SupportFacultyOperationDTO {
    public OperationType operation;
    @Nullable
    public UUID id;
    public SupportFacultyDTO value;
}
