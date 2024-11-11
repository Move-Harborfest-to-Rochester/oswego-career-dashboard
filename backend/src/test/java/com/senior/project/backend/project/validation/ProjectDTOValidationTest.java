package com.senior.project.backend.project.validation;

import java.util.Date;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.senior.project.backend.project.ProjectDTO;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;

public class ProjectDTOValidationTest {
    private static Validator validator;
    private ProjectDTO projectDTO = new ProjectDTO();

    @BeforeAll
    public static void setup() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }
    
    @BeforeEach
    public void eachSetup() {
        projectDTO.setName("Test Job");
        projectDTO.setDescription("Description");
        projectDTO.setStartDate(new Date(1704085200));
        projectDTO.setEndDate(new Date(1704085300));
    }

    @Test
    public void testSuccess() {
        Set<ConstraintViolation<ProjectDTO>> violations = validator.validate(projectDTO);

        assert(violations.size() == 0);
    }
    
    @Test
    public void testRequiredName() {
        projectDTO.setName(null);

        Set<ConstraintViolation<ProjectDTO>> violations = validator.validate(projectDTO);

        assert(violations.size() == 1);
        assert(violations.iterator().next().getMessage().equals("name is required."));
    }
    
    @Test
    public void testRequiredDescription() {
        projectDTO.setDescription(null);

        Set<ConstraintViolation<ProjectDTO>> violations = validator.validate(projectDTO);

        assert(violations.size() == 1);
        assert(violations.iterator().next().getMessage().equals("description is required."));
    }
    
    @Test
    public void testRequiredStartDate() {
        projectDTO.setStartDate(null);

        Set<ConstraintViolation<ProjectDTO>> violations = validator.validate(projectDTO);

        assert(violations.size() == 1);
        assert(violations.iterator().next().getMessage().equals("startDate is required."));
    }
    
    @Test
    public void testStartDateBeforeEndDate() {
        projectDTO.setEndDate(new Date(projectDTO.getStartDate().getTime() - 1000));

        Set<ConstraintViolation<ProjectDTO>> violations = validator.validate(projectDTO);

        assert(violations.size() == 1);
        assert(violations.iterator().next().getMessage().equals("startDate must be before endDate."));
    }
}
