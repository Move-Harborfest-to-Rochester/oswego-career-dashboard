package com.senior.project.backend.basacoffice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BasacOfficeFacultyService {
    private final BasacOfficeFacultyRepository basacOfficeFacultyRepository;

    public BasacOfficeFacultyService(@Autowired BasacOfficeFacultyRepository basacOfficeFacultyRepository) {
        this.basacOfficeFacultyRepository = basacOfficeFacultyRepository;
    }
}