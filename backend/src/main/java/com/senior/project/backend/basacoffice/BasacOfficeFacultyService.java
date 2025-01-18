package com.senior.project.backend.basacoffice;

import com.senior.project.backend.common.models.Patch;
import com.senior.project.backend.domain.BasacOfficeFaculty;
import com.senior.project.backend.util.NonBlockingExecutor;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
public class BasacOfficeFacultyService {
    private final BasacOfficeFacultyRepository basacOfficeFacultyRepository;

    public BasacOfficeFacultyService(@Autowired BasacOfficeFacultyRepository basacOfficeFacultyRepository) {
        this.basacOfficeFacultyRepository = basacOfficeFacultyRepository;
    }

    public Flux<BasacOfficeFaculty> getAllBasacOfficeFaculty() {
        return NonBlockingExecutor.executeMany(basacOfficeFacultyRepository::findAll);
    }

    private Mono<BasacOfficeFaculty> saveBasacOfficeFaculty(BasacOfficeFaculty basacOfficeFaculty) {
        return NonBlockingExecutor.execute(() -> basacOfficeFacultyRepository.save(basacOfficeFaculty));
    }

    private void deleteBasacOfficeFaculty(UUID id) {
        basacOfficeFacultyRepository.deleteById(id);
    }

    @Transactional
    public Flux<BasacOfficeFaculty> patchBasacOffice(Patch<BasacOfficeFaculty> patch) {
        return Flux.fromIterable(patch.getOperations())
                .concatMap(operation -> {
                    switch (operation.getOp()) {
                        case "add" -> {
                            return saveBasacOfficeFaculty(operation.getValue());
                        }
                        case "remove" -> {
                            deleteBasacOfficeFaculty(operation.getValue().getId());
                            return Mono.empty();
                        }
                        case "replace" -> {
                            return patchBasacOfficeFaculty(operation.getId(), operation.getValue());
                        }
                        default -> {
                            return Flux.error(new IllegalArgumentException("Unsupported operation: " + operation.getOp()));
                        }
                    }
                });

    }

    private Mono<BasacOfficeFaculty> patchBasacOfficeFaculty(UUID id, BasacOfficeFaculty basacOfficeFaculty) {
        return getBasacOfficeFaculty(id).flatMap(facultyToUpdate -> {
            facultyToUpdate.setName(basacOfficeFaculty.getName());
            facultyToUpdate.setTitle(basacOfficeFaculty.getTitle());
            facultyToUpdate.setEmail(basacOfficeFaculty.getEmail());
            return NonBlockingExecutor.execute(() -> basacOfficeFacultyRepository.save(facultyToUpdate));
        });
    }

    private Mono<BasacOfficeFaculty> getBasacOfficeFaculty(UUID id) {
        return NonBlockingExecutor.execute(() -> basacOfficeFacultyRepository.findById(id).orElse(null));
    }
}