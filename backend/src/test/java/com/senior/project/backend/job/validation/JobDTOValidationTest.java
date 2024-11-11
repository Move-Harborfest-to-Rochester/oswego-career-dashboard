package com.senior.project.backend.job.validation;

import java.util.Date;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.senior.project.backend.job.JobDTO;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;

public class JobDTOValidationTest {
    private static Validator validator;
    private JobDTO jobDTO = new JobDTO();

    @BeforeAll
    public static void setup() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }
    
    @BeforeEach
    public void eachSetup() {
        jobDTO.setName("Test Job");
        jobDTO.setLocation("Test Location");
        jobDTO.setCoop(true);
        jobDTO.setStartDate(new Date(1704085200));
        jobDTO.setEndDate(new Date(1704085300));
    }

    @Test
    public void testJobDTOSuccess() {
        Set<ConstraintViolation<JobDTO>> violations = validator.validate(jobDTO);

        assert(violations.size() == 0);
    }
    
    @Test
    public void testJobDTORequiredName() {
        jobDTO.setName(null);

        Set<ConstraintViolation<JobDTO>> violations = validator.validate(jobDTO);

        assert(violations.size() == 1);
        assert(violations.iterator().next().getMessage().equals("name is required."));
    }
    
    @Test
    public void testJobDTORequiredLocation() {
        jobDTO.setLocation(null);

        Set<ConstraintViolation<JobDTO>> violations = validator.validate(jobDTO);

        assert(violations.size() == 1);
        assert(violations.iterator().next().getMessage().equals("location is required."));
    }
    
    @Test
    public void testJobDTORequiredStartDate() {
        jobDTO.setStartDate(null);

        Set<ConstraintViolation<JobDTO>> violations = validator.validate(jobDTO);

        assert(violations.size() == 1);
        assert(violations.iterator().next().getMessage().equals("startDate is required."));
    }
    
    @Test
    public void testJobDTOStartDateBeforeEndDate() {
        jobDTO.setEndDate(new Date(jobDTO.getStartDate().getTime() - 1000));

        Set<ConstraintViolation<JobDTO>> violations = validator.validate(jobDTO);

        assert(violations.size() == 1);
        assert(violations.iterator().next().getMessage().equals("startDate must be before endDate."));
    }
}
