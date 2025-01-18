package com.senior.project.backend.basacoffice;

import com.senior.project.backend.common.models.Patch;
import com.senior.project.backend.domain.BasacOfficeFaculty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

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

    private BasacOfficeFaculty saveBasacOfficeFaculty(BasacOfficeFaculty basacOfficeFaculty) {
        return basacOfficeFacultyRepository.save(basacOfficeFaculty);
    }

    private void deleteBasacOfficeFaculty(UUID id) {
        basacOfficeFacultyRepository.deleteById(id);
    }

    public Mono<?> patchBasacOffice(Patch<BasacOfficeFaculty> patch) {
        // TODO: implement
        return Mono.empty();
    }
}