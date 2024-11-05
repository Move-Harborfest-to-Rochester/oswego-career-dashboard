package com.senior.project.backend.project;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Date;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Project;
import com.senior.project.backend.domain.StudentDetails;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.studentdetails.StudentDetailsRepository;
import com.senior.project.backend.users.UserRepository;

import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceTest {
    @InjectMocks
    private ProjectService projectService;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private StudentDetailsRepository studentDetailsRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CurrentUserUtil currentUserUtil;

    private User createTestUser() {
        return User.builder().id(Constants.userStudent.getId()).email(Constants.userStudent.getEmail()).phoneNumber(Constants.userStudent.getPhoneNumber()).dateCreated(Constants.userStudent.getDateCreated()).lastLogin(Constants.userStudent.getLastLogin()).firstName(Constants.userStudent.getFirstName()).lastName(Constants.userStudent.getLastName()).preferredName(Constants.userStudent.getPreferredName()).canEmail(Constants.userStudent.isCanEmail()).canText(Constants.userStudent.isCanText()).linkedin(Constants.userStudent.getLinkedin()).signedUp(Constants.userStudent.isSignedUp()).role(Constants.userStudent.getRole()).profilePictureId(Constants.userStudent.getProfilePictureId()).studentDetails(new StudentDetails()).build();
    }

    @Test
    public void testSaveProject() {
        ProjectDTO request = new ProjectDTO(null, "name", "location", new Date(), new Date());
        User testUser = createTestUser();
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setStudentDetails(testUser.getStudentDetails());
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(testUser));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        Mono<Project> projectMono = projectService.saveProject(request);

        StepVerifier.create(projectMono).expectNext(project).verifyComplete();
        verify(currentUserUtil, times(1)).getCurrentUser();
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    public void testSaveProjectNoStudentDetails() {
        ProjectDTO request = new ProjectDTO(null, "name", "description", new Date(), new Date());
        Project project = new Project();
        project.setName(request.getName());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userStudent));
        when(projectRepository.save(any(Project.class))).thenReturn(project);
        when(studentDetailsRepository.save(any(StudentDetails.class))).thenReturn(new StudentDetails());
        when(userRepository.save(any(User.class))).thenReturn(null);
        Mono<Project> projectMono = projectService.saveProject(request);
        StepVerifier.create(projectMono)
                .expectNext(project)
                .verifyComplete();

        verify(studentDetailsRepository, never()).save(any(StudentDetails.class));
    }
}