package com.senior.project.backend.portfolio;

import com.senior.project.backend.Constants;
import com.senior.project.backend.degreeprogram.DegreeProgramRepository;
import com.senior.project.backend.domain.Interest;
import com.senior.project.backend.domain.Skill;
import com.senior.project.backend.domain.StudentDetails;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.domain.YearLevel;
import com.senior.project.backend.portfolio.dto.EditEducationDTO;
import com.senior.project.backend.portfolio.dto.PersonalInfoDTO;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.studentdetails.StudentDetailsRepository;
import com.senior.project.backend.users.UserRepository;

import java.util.ArrayList;
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

    @Mock
    DegreeProgramRepository degreeProgramRepository;

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
  @Test
  public void testSaveSkillsExistingStudentDetails() {
    // Create an existing StudentDetails.
    StudentDetails studentDetails = new StudentDetails();
    // Set the test user to already have student details.
    mockUser.setStudentDetails(studentDetails);
    // Stub save to return the same instance.
    when(studentDetailsRepository.save(any(StudentDetails.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    // Create a list of skills.
    ArrayList<Skill> skills = new ArrayList<>();
    Skill skill1 = new Skill();
    skill1.setName("Java");
    Skill skill2 = new Skill();
    skill2.setName("Spring");
    skills.add(skill1);
    skills.add(skill2);

    Mono<StudentDetails> result = portfolioService.saveSkills(skills);

    StepVerifier.create(result)
        .assertNext(sd -> {
          // Verify the skills list is set.
          assertEquals(skills, sd.getSkills());
          // Verify each skill's studentDetails is set to sd.
          for (Skill s : skills) {
            assertEquals(sd, s.getStudentDetails());
          }
        })
        .verifyComplete();
  }

  @Test
  public void testSaveSkillsNoStudentDetails() {
    // Simulate that the user has no StudentDetails.
    mockUser.setStudentDetails(null);
    when(studentDetailsRepository.save(any(StudentDetails.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    ArrayList<Skill> skills = new ArrayList<>();
    Skill skill = new Skill();
    skill.setName("Python");
    skills.add(skill);

    Mono<StudentDetails> result = portfolioService.saveSkills(skills);

    StepVerifier.create(result)
        .assertNext(sd -> {
          assertEquals(skills, sd.getSkills());
          for (Skill s : skills) {
            assertEquals(sd, s.getStudentDetails());
          }
        })
        .verifyComplete();
  }

  // --- New tests for saveInterests ---
  @Test
  public void testSaveInterestsExistingStudentDetails() {
    // Create an existing StudentDetails.
    StudentDetails studentDetails = new StudentDetails();
    mockUser.setStudentDetails(studentDetails);
    when(studentDetailsRepository.save(any(StudentDetails.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    ArrayList<Interest> interests = new ArrayList<>();
    Interest interest1 = new Interest();
    interest1.setName("Music");
    Interest interest2 = new Interest();
    interest2.setName("Sports");
    interests.add(interest1);
    interests.add(interest2);

    Mono<StudentDetails> result = portfolioService.saveInterests(interests);

    StepVerifier.create(result)
        .assertNext(sd -> {
          assertEquals(interests, sd.getInterests());
          for (Interest i : interests) {
            assertEquals(sd, i.getStudentDetails());
          }
        })
        .verifyComplete();
  }

  @Test
  public void testSaveInterestsNoStudentDetails() {
    // Simulate user has no StudentDetails.
    mockUser.setStudentDetails(null);
    when(studentDetailsRepository.save(any(StudentDetails.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    ArrayList<Interest> interests = new ArrayList<>();
    Interest interest = new Interest();
    interest.setName("Reading");
    interests.add(interest);

    Mono<StudentDetails> result = portfolioService.saveInterests(interests);

    StepVerifier.create(result)
        .assertNext(sd -> {
          assertEquals(interests, sd.getInterests());
          for (Interest i : interests) {
            assertEquals(sd, i.getStudentDetails());
          }
        })
        .verifyComplete();
  }
}

