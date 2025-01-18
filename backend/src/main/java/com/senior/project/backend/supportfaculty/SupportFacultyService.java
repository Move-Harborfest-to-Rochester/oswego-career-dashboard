package com.senior.project.backend.supportfaculty;

import com.senior.project.backend.domain.SupportFaculty;
import com.senior.project.backend.util.NonBlockingExecutor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
public class SupportFacultyService {
    private final SupportFacultyRepository supportFacultyRepository;

    public SupportFacultyService(@Autowired SupportFacultyRepository supportFacultyRepository) {
        this.supportFacultyRepository = supportFacultyRepository;
    }

    private Flux<SupportFaculty> allSupportFaculty() {
        return NonBlockingExecutor.executeMany(supportFacultyRepository::findAll);
    }

    private void deleteSupportFaculty(UUID supportFacultyId) {
        supportFacultyRepository.deleteById(supportFacultyId);
    }

    private Mono<SupportFaculty> saveSupportFaculty(SupportFaculty supportFaculty) {
        return NonBlockingExecutor.execute(() -> supportFacultyRepository.saveAndFlush(supportFaculty));
    }
}