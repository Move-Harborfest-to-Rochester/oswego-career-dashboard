package com.senior.project.backend.basacoffice;

import com.senior.project.backend.basacoffice.dto.BasacOfficeFacultyDTO;
import com.senior.project.backend.common.models.Patch;
import com.senior.project.backend.common.models.PatchOperation;
import com.senior.project.backend.domain.BasacOfficeFaculty;
import com.senior.project.backend.util.NonBlockingExecutor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.Callable;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BasacOfficeFacultyServiceTest {

  @InjectMocks
  private BasacOfficeFacultyService service;

  @Mock
  private BasacOfficeFacultyRepository repository;

  @Test
  public void testGetAllBasacOfficeFaculty() {
    // Create two dummy faculties.
    BasacOfficeFaculty faculty1 = BasacOfficeFaculty.builder()
        .id(UUID.fromString("11111111-1111-1111-1111-111111111111"))
        .name("Faculty One")
        .build();
    BasacOfficeFaculty faculty2 = BasacOfficeFaculty.builder()
        .id(UUID.fromString("22222222-2222-2222-2222-222222222222"))
        .name("Faculty Two")
        .build();

    when(repository.findAll()).thenReturn(List.of(faculty1, faculty2));

    try (MockedStatic<NonBlockingExecutor> execMock = mockStatic(NonBlockingExecutor.class)) {
      execMock.when(() -> NonBlockingExecutor.executeMany(any(Callable.class)))
          .thenAnswer(invocation -> {
            Callable<List<BasacOfficeFaculty>> callable = invocation.getArgument(0);
            try {
              return Flux.fromIterable(callable.call());
            } catch (Exception e) {
              return Flux.error(e);
            }
          });

      Flux<BasacOfficeFaculty> result = service.getAllBasacOfficeFaculty();
      StepVerifier.create(result)
          .expectNext(faculty1)
          .expectNext(faculty2)
          .verifyComplete();
    }
  }

  @Test
  public void testPatchBasacOfficeAdd() {
    // Create a dummy DTO and simulate its toDomain() conversion.
    BasacOfficeFacultyDTO dto = BasacOfficeFacultyDTO.builder()
        .name("New Faculty")
        .build();
    // Create an "add" operation.
    PatchOperation<BasacOfficeFacultyDTO> addOp = new PatchOperation<>() {
      @Override
      public BasacOfficeFacultyDTO getValue() {
        return dto;
      }
    };
    addOp.setOp("add");

    Patch<BasacOfficeFacultyDTO> patch = new Patch<>();
    patch.setOperations(List.of(addOp));

    // The domain object produced by toDomain()
    BasacOfficeFaculty newFaculty = BasacOfficeFaculty.builder()
        .id(UUID.randomUUID())
        .name("New Faculty")
        .build();
    when(repository.save(any(BasacOfficeFaculty.class))).thenReturn(newFaculty);

    try (MockedStatic<NonBlockingExecutor> execMock = mockStatic(NonBlockingExecutor.class)) {
      execMock.when(() -> NonBlockingExecutor.execute(any(Callable.class)))
          .thenAnswer(invocation -> {
            Callable<?> callable = invocation.getArgument(0);
            try {
              return Mono.just(callable.call());
            } catch (Exception e) {
              return Mono.error(e);
            }
          });
      Flux<BasacOfficeFaculty> result = service.patchBasacOffice(patch);
      StepVerifier.create(result)
          .expectNext(newFaculty)
          .verifyComplete();
    }
  }

  @Test
  public void testPatchBasacOfficeRemove() {
    // For remove, we only need the id.
    UUID removeId = UUID.randomUUID();
    PatchOperation<BasacOfficeFacultyDTO> removeOp = new PatchOperation<>();
    removeOp.setOp("remove");
    removeOp.setId(removeId);

    Patch<BasacOfficeFacultyDTO> patch = new Patch<>();
    patch.setOperations(List.of(removeOp));

    // Expect that repository.deleteById is called.
    doNothing().when(repository).deleteById(removeId);

    try (MockedStatic<NonBlockingExecutor> execMock = mockStatic(NonBlockingExecutor.class)) {
      execMock.when(() -> NonBlockingExecutor.execute(any(Callable.class)))
          .thenAnswer(invocation -> {
            Callable<?> callable = invocation.getArgument(0);
            try {
              return Mono.just(callable.call());
            } catch (Exception e) {
              return Mono.error(e);
            }
          });
      Flux<BasacOfficeFaculty> result = service.patchBasacOffice(patch);
      StepVerifier.create(result)
          .verifyComplete();
      verify(repository, times(1)).deleteById(removeId);
    }
  }

  @Test
  public void testPatchBasacOfficeReplace() {
    // Simulate retrieval of an existing faculty.
    UUID existingId = UUID.randomUUID();
    BasacOfficeFaculty existingFaculty = BasacOfficeFaculty.builder()
        .id(existingId)
        .name("Old Name")
        .build();
    when(repository.findById(existingId)).thenReturn(Optional.of(existingFaculty));

    // Create an updated DTO.
    BasacOfficeFacultyDTO updateDTO = BasacOfficeFacultyDTO.builder()
        .id(existingId)
        .name("New Name")
        .build();

    // Create a replace operation that applies the update.
    PatchOperation<BasacOfficeFacultyDTO> replaceOp = new PatchOperation<>() {
      @Override
      public BasacOfficeFacultyDTO applyTo(BasacOfficeFacultyDTO original) {
        return updateDTO;
      }
    };
    replaceOp.setOp("replace");
    replaceOp.setId(existingId);

    Patch<BasacOfficeFacultyDTO> patch = new Patch<>();
    patch.setOperations(List.of(replaceOp));

    // Stub repository.save() to return the updated faculty.
    BasacOfficeFaculty updatedFaculty = BasacOfficeFaculty.builder()
        .id(existingId)
        .name("New Name")
        .build();
    when(repository.save(any(BasacOfficeFaculty.class))).thenReturn(updatedFaculty);

    try (MockedStatic<NonBlockingExecutor> execMock = mockStatic(NonBlockingExecutor.class)) {
      execMock.when(() -> NonBlockingExecutor.execute(any(Callable.class)))
          .thenAnswer(invocation -> {
            Callable<?> callable = invocation.getArgument(0);
            try {
              return Mono.just(callable.call());
            } catch (Exception e) {
              return Mono.error(e);
            }
          });
      Flux<BasacOfficeFaculty> result = service.patchBasacOffice(patch);
      StepVerifier.create(result)
          .expectNext(updatedFaculty)
          .verifyComplete();
    }
  }

  @Test
  public void testPatchBasacOfficeUnsupportedOperation() {
    // Create an operation with an unsupported op.
    PatchOperation<BasacOfficeFacultyDTO> unsupportedOp = new PatchOperation<>();
    unsupportedOp.setOp("foo");
    unsupportedOp.setId(UUID.randomUUID());

    Patch<BasacOfficeFacultyDTO> patch = new Patch<>();
    patch.setOperations(List.of(unsupportedOp));

    try (MockedStatic<NonBlockingExecutor> execMock = mockStatic(NonBlockingExecutor.class)) {
      execMock.when(() -> NonBlockingExecutor.execute(any(Callable.class)))
          .thenAnswer(invocation -> {
            Callable<?> callable = invocation.getArgument(0);
            try {
              return Mono.just(callable.call());
            } catch (Exception e) {
              return Mono.error(e);
            }
          });
      Flux<BasacOfficeFaculty> result = service.patchBasacOffice(patch);
      StepVerifier.create(result)
          .expectErrorMatches(throwable ->
              throwable instanceof IllegalArgumentException &&
                  throwable.getMessage().contains("Unsupported operation: foo"))
          .verify();
    }
  }
}
