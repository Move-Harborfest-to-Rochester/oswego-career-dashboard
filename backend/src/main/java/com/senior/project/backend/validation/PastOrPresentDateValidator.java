package com.senior.project.backend.validation;

import java.util.Date;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PastOrPresentDateValidator implements ConstraintValidator<PastOrPresentDate, Date> {
    @Override
    public boolean isValid(Date value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        Date currentDate = new Date();
        return !value.after(currentDate);
    }
}
