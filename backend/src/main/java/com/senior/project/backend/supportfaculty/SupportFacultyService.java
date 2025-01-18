package com.senior.project.backend.supportfaculty;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupportFacultyService {
    private final SupportFacultyRepository supportFacultyRepository;

    public SupportFacultyService(@Autowired SupportFacultyRepository supportFacultyRepository) {
        this.supportFacultyRepository = supportFacultyRepository;
    }
}