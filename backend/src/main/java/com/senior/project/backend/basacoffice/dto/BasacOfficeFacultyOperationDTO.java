package com.senior.project.backend.basacoffice.dto;

import com.senior.project.backend.util.OperationType;
import jakarta.annotation.Nullable;

import java.util.UUID;

public class BasacOfficeFacultyOperationDTO {
    public OperationType operation;
    @Nullable
    public UUID id;
    public BasacOfficeFacultyDTO value;
}