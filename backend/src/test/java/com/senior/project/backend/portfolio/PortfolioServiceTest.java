package com.senior.project.backend.portfolio;

import com.senior.project.backend.domain.StudentDetails;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.portfolio.dto.PersonalInfoDTO;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.studentdetails.StudentDetailsRepository;
import com.senior.project.backend.users.UserRepository;

import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class PortfolioServiceTest {
    @InjectMocks
    private PortfolioService portfolioService;

    @Mock
    private CurrentUserUtil currentUserUtil;

    @Mock
    private StudentDetailsRepository studentDetailsRepository;

    @Mock
    private UserRepository userRepository;

    private User mockUser;

    @BeforeEach
    public void setup() {
        mockUser = new User();
        mockUser.setId(UUID.randomUUID());
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(mockUser));
    }

    @Test
    public void testSavePersonalInfoExistingStudentDetails() {
        mockUser.setStudentDetails(new StudentDetails());
        PersonalInfoDTO dto = PersonalInfoDTO.builder()
                .firstName("John")
                .preferredName("Johnny")
                .lastName("Doe")
                .email("jdoe@email.com")
                .phoneNumber("123-456-7890")
                .linkedIn("https://linkedin.com/in/johndoe")
                .description("Software Developer")
            .build();
        
        Mono<PersonalInfoDTO> result = portfolioService.savePersonalInfo(dto);

        StepVerifier
            .create(result)
            .expectNextMatches(savedInfo -> {
                assertEquals(dto.getFirstName(), savedInfo.getFirstName());
                assertEquals(dto.getPreferredName(), savedInfo.getPreferredName());
                assertEquals(dto.getLastName(), savedInfo.getLastName());
                assertEquals(dto.getEmail(), savedInfo.getEmail());
                assertEquals(dto.getPhoneNumber(), savedInfo.getPhoneNumber());
                assertEquals(dto.getLinkedIn(), savedInfo.getLinkedIn());
                assertEquals(dto.getDescription(), savedInfo.getDescription());
                return true;
            })
            .verifyComplete();
    }

    @Test
    public void testSavePersonalInfoNoStudentDetails() {
        when(studentDetailsRepository.save(any(StudentDetails.class))).thenAnswer(invocation -> {
            mockUser.setStudentDetails(invocation.getArgument(0));
            return invocation.getArgument(0);
        });
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        mockUser.setStudentDetails(null);
        PersonalInfoDTO dto = PersonalInfoDTO.builder()
                .firstName("John")
                .preferredName("Johnny")
                .lastName("Doe")
                .email("jdoe@email.com")
                .phoneNumber("123-456-7890")
                .linkedIn("https://linkedin.com/in/johndoe")
                .description("Software Developer")
            .build();
        
        Mono<PersonalInfoDTO> result = portfolioService.savePersonalInfo(dto);

        StepVerifier
            .create(result)
            .expectNextMatches(savedInfo -> {
                assertEquals(dto.getFirstName(), savedInfo.getFirstName());
                assertEquals(dto.getPreferredName(), savedInfo.getPreferredName());
                assertEquals(dto.getLastName(), savedInfo.getLastName());
                assertEquals(dto.getEmail(), savedInfo.getEmail());
                assertEquals(dto.getPhoneNumber(), savedInfo.getPhoneNumber());
                assertEquals(dto.getLinkedIn(), savedInfo.getLinkedIn());
                assertEquals(dto.getDescription(), savedInfo.getDescription());
                return true;
            })
            .verifyComplete();
    }
}
