package com.senior.project.backend.portfolio;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.senior.project.backend.Constants;
import com.senior.project.backend.degreeprogram.DegreeProgramRepository;
import com.senior.project.backend.domain.StudentDetails;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.domain.YearLevel;
import com.senior.project.backend.portfolio.dto.EditEducationDTO;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.studentdetails.StudentDetailsRepository;
import com.senior.project.backend.users.UserRepository;

import reactor.core.publisher.Mono;

@ExtendWith(MockitoExtension.class)
public class PortfolioServiceTest {
    @InjectMocks
    private PortfolioService portfolioService;

    @Mock
    CurrentUserUtil currentUserUtil;

    @Mock
    StudentDetailsRepository studentDetailsRepository;

    @Mock
    DegreeProgramRepository degreeProgramRepository;

    @Mock
    UserRepository userRepository;

    @BeforeEach
    public void setUp() {
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userStudent));
    }

    @Test
    public void testSaveEducationExistingStudentDetails() {
        User student = Constants.userStudent;
        student.setStudentDetails(new StudentDetails());
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(student));

        EditEducationDTO educationDTO = EditEducationDTO.builder()
                .universityId(1)
                .year(YearLevel.Freshman)
                .gpa(3.5)
                .build();

        portfolioService.saveEducation(educationDTO).subscribe((user) -> {
            assertEquals(1, user.getUniversityId());
            assertEquals(3.5, user.getGpa());
            assertEquals(YearLevel.Freshman, user.getYear());
            verify(studentDetailsRepository, times(1)).save(any(StudentDetails.class));
            verify(userRepository, times(0)).save(any(User.class));
        });
    }

    @Test
    public void testSaveEducationNoStudentDetails() {
        EditEducationDTO educationDTO = EditEducationDTO.builder()
                .universityId(1)
                .year(YearLevel.Freshman)
                .gpa(3.5)
                .build();

        portfolioService.saveEducation(educationDTO).subscribe((user) -> {
            assertEquals(1, user.getUniversityId());
            assertEquals(3.5, user.getGpa());
            assertEquals(YearLevel.Freshman, user.getYear());
            verify(studentDetailsRepository, times(1)).save(any(StudentDetails.class));
            verify(userRepository, times(1)).save(any(User.class));
        });
    }
}
