package com.senior.project.backend.clubs;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Date;
import java.util.UUID;

import com.senior.project.backend.domain.Club;
import com.senior.project.backend.domain.StudentDetails;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.studentdetails.StudentDetailsRepository;
import com.senior.project.backend.users.UserRepository;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ClubServiceTest {

  @InjectMocks
  private ClubService clubService;

  @Mock
  private StudentDetailsRepository studentDetailsRepository;
  @Mock
  private UserRepository userRepository;
  @Mock
  private ClubRepository clubRepository;
  @Mock
  private CurrentUserUtil currentUserUtil;

  private User userWithDetails;
  private StudentDetails existingDetails;
  private User userWithoutDetails;

  @BeforeEach
  public void setup() {
    // Create a user with existing StudentDetails.
    userWithDetails = new User();
    userWithDetails.setId(UUID.randomUUID());
    existingDetails = new StudentDetails();
    userWithDetails.setStudentDetails(existingDetails);

    // Create a user without StudentDetails.
    userWithoutDetails = new User();
    userWithoutDetails.setId(UUID.randomUUID());
    userWithoutDetails.setStudentDetails(null);
  }

  @Test
  public void testSaveClubWithExistingStudentDetails() {
    // Create a ClubDTO with no id.
    ClubDTO clubDTO = new ClubDTO();
    clubDTO.setName("Test Club");
    // Use new Date(123, 0, 1) for January 1, 2023, and new Date(123, 11, 31) for December 31, 2023.
    Date startDate = new Date(123, 0, 1);
    Date endDate = new Date(123, 11, 31);
    clubDTO.setStartDate(startDate);
    clubDTO.setEndDate(endDate);

    // Stub currentUserUtil to return a user with existing StudentDetails.
    when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(userWithDetails));

    // Stub clubRepository.save to return a Club built from the DTO.
    Club savedClub = new Club();
    savedClub.setName("Test Club");
    savedClub.setStartDate(startDate);
    savedClub.setEndDate(endDate);
    savedClub.setStudentDetails(existingDetails);
    when(clubRepository.save(any(Club.class))).thenReturn(savedClub);

    Mono<Club> result = clubService.saveClub(clubDTO);
    StepVerifier.create(result)
        .expectNextMatches(club -> "Test Club".equals(club.getName()) &&
            club.getStartDate().equals(startDate) &&
            club.getEndDate().equals(endDate) &&
            club.getStudentDetails() == existingDetails)
        .verifyComplete();

    // Verify that no new StudentDetails were created
    verify(studentDetailsRepository, times(0)).save(any(StudentDetails.class));
    verify(userRepository, times(0)).save(any(User.class));
  }

  @Test
  public void testSaveClubWithoutExistingStudentDetails() {
    // Create a ClubDTO with an id.
    ClubDTO clubDTO = new ClubDTO();
    UUID clubId = UUID.randomUUID();
    clubDTO.setId(clubId);
    clubDTO.setName("New Club");
    Date startDate = new Date(123, 0, 1);
    Date endDate = new Date(123, 11, 31);
    clubDTO.setStartDate(startDate);
    clubDTO.setEndDate(endDate);

    // Stub currentUserUtil to return a user with no StudentDetails.
    when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(userWithoutDetails));

    // Stub studentDetailsRepository.save to return a new StudentDetails.
    StudentDetails newDetails = new StudentDetails();
    when(studentDetailsRepository.save(any(StudentDetails.class))).thenReturn(newDetails);
    // Stub userRepository.save to return the updated user.
    when(userRepository.save(any(User.class))).thenReturn(userWithoutDetails);

    // Stub clubRepository.save to return a Club with the new details.
    Club savedClub = new Club();
    savedClub.setId(clubId);
    savedClub.setName("New Club");
    savedClub.setStartDate(startDate);
    savedClub.setEndDate(endDate);
    savedClub.setStudentDetails(newDetails);
    when(clubRepository.save(any(Club.class))).thenReturn(savedClub);

    Mono<Club> result = clubService.saveClub(clubDTO);
    StepVerifier.create(result)
        .expectNextMatches(club -> club.getId().equals(clubId) &&
            "New Club".equals(club.getName()) &&
            club.getStartDate().equals(startDate) &&
            club.getEndDate().equals(endDate) &&
            club.getStudentDetails() == newDetails)
        .verifyComplete();

    // Verify that a new StudentDetails was created and the user updated.
    verify(studentDetailsRepository, times(1)).save(any(StudentDetails.class));
    verify(userRepository, times(1)).save(any(User.class));
  }

  @Test
  public void testDeleteClub() {
    UUID clubId = UUID.randomUUID();
    doNothing().when(clubRepository).deleteById(clubId);
    clubService.deleteClub(clubId);
    verify(clubRepository, times(1)).deleteById(clubId);
  }
}
