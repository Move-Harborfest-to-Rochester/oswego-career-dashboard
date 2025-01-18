package com.senior.project.backend.basacoffice;

import com.senior.project.backend.domain.BasacOfficeFaculty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BasacOfficeFacultyService {
    private final BasacOfficeFacultyRepository basacOfficeFacultyRepository;

    public BasacOfficeFacultyService(@Autowired BasacOfficeFacultyRepository basacOfficeFacultyRepository) {
        this.basacOfficeFacultyRepository = basacOfficeFacultyRepository;
    }

    public List<BasacOfficeFaculty> getAllBasacOfficeFaculty() {
        return basacOfficeFacultyRepository.findAll();
    }

    public BasacOfficeFaculty saveBasacOfficeFaculty(BasacOfficeFaculty basacOfficeFaculty) {
        return basacOfficeFacultyRepository.save(basacOfficeFaculty);
    }

    public void deleteBasacOfficeFaculty(UUID id) {
        basacOfficeFacultyRepository.deleteById(id);
    }
}