package com.senior.project.backend.job;

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
import com.senior.project.backend.domain.Job;
import com.senior.project.backend.domain.StudentDetails;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.studentdetails.StudentDetailsRepository;
import com.senior.project.backend.users.UserRepository;

import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
public class JobServiceTest {
    @InjectMocks
    private JobService jobService;
    @Mock
    private JobRepository jobRepository;
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
    public void testSaveJob() {
        JobDTO request = new JobDTO(null, "name", "description", "location", new Date(), new Date(), false);
        User testUser = createTestUser();
        Job job = new Job();
        job.setName(request.getName());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setCoop(request.isCoop());
        job.setStartDate(request.getStartDate());
        job.setEndDate(request.getEndDate());
        job.setStudentDetails(testUser.getStudentDetails());
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(testUser));
        when(jobRepository.save(any(Job.class))).thenReturn(job);

        Mono<Job> jobMono = jobService.saveJob(request);

        StepVerifier.create(jobMono).expectNext(job).verifyComplete();
        verify(currentUserUtil, times(1)).getCurrentUser();
        verify(jobRepository, times(1)).save(any(Job.class));
    }

    @Test
    public void testSaveJobNoStudentDetails() {

        JobDTO request = new JobDTO(null, "name", "description", "location", new Date(), new Date(), false);
        Job job = new Job();
        job.setName(request.getName());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setCoop(request.isCoop());
        job.setStartDate(request.getStartDate());
        job.setEndDate(request.getEndDate());
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userStudent));
        when(jobRepository.save(any(Job.class))).thenReturn(job);
        when(studentDetailsRepository.save(any(StudentDetails.class))).thenReturn(new StudentDetails());
        when(userRepository.save(any(User.class))).thenReturn(null);

        Mono<Job> jobMono = jobService.saveJob(request);

        StepVerifier.create(jobMono).expectNext(job).verifyComplete();
        verify(studentDetailsRepository, times(1)).save(any(StudentDetails.class));
    }
}
