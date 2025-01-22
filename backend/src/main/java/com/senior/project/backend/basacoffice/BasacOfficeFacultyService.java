package com.senior.project.backend.basacoffice;

import com.senior.project.backend.basacoffice.dto.BasacOfficeFacultyDTO;
import com.senior.project.backend.common.models.Patch;
import com.senior.project.backend.common.models.PatchOperation;
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
    public Flux<BasacOfficeFaculty> patchBasacOffice(Patch<BasacOfficeFacultyDTO> patch) {
        return Flux.fromIterable(patch.getOperations())
                .concatMap(operation -> {
                    switch (operation.getOp()) {
                        case "add" -> {
                            return saveBasacOfficeFaculty(operation.getValue().toDomain());
                        }
                        case "remove" -> {
                            deleteBasacOfficeFaculty(operation.getId());
                            return Mono.empty();
                        }
                        case "replace" -> {
                            return patchBasacOfficeFaculty(operation);
                        }
                        default -> {
                            return Flux.error(new IllegalArgumentException("Unsupported operation: " + operation.getOp()));
                        }
                    }
                });

    }

    private Mono<BasacOfficeFaculty> patchBasacOfficeFaculty(PatchOperation<BasacOfficeFacultyDTO> patchOperation) {
        return getBasacOfficeFaculty(patchOperation.getId()).flatMap(facultyToUpdate -> {
            BasacOfficeFacultyDTO facultyToUpdateDTO = facultyToUpdate.toDTO();
            BasacOfficeFaculty updatedFaculty = patchOperation.applyTo(facultyToUpdateDTO).toDomain();
            return NonBlockingExecutor.execute(() -> basacOfficeFacultyRepository.save(updatedFaculty));
        });
    }

    private Mono<BasacOfficeFaculty> getBasacOfficeFaculty(UUID id) {
        return NonBlockingExecutor.execute(() -> basacOfficeFacultyRepository.findById(id).orElse(null));
    }
}