package com.senior.project.backend.clubs;

import com.senior.project.backend.domain.Club;
import com.senior.project.backend.domain.StudentDetails;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.studentdetails.StudentDetailsRepository;
import com.senior.project.backend.users.UserRepository;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class ClubService {

  @Autowired
  private StudentDetailsRepository studentDetailsRepository;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private ClubRepository clubRepository;

  @Autowired
  private CurrentUserUtil currentUserUtil;

  private StudentDetails getOrCreateStudentDetails(User user) {
    StudentDetails studentDetails = user.getStudentDetails();
    if (studentDetails == null) {
      studentDetails = new StudentDetails();
      studentDetails = studentDetailsRepository.save(studentDetails);
      user.setStudentDetails(studentDetails);
      userRepository.save(user);
    }
    return studentDetails;
  }


  public Mono<Club> saveClub(ClubDTO clubDTO){
      return currentUserUtil.getCurrentUser().flatMap(user -> {
        StudentDetails sD = getOrCreateStudentDetails(user);
        Club club = new Club();
        if (clubDTO.getId() != null) {
          club.setId(clubDTO.getId());
        }
        club.setName(clubDTO.getName());
        club.setStartDate(clubDTO.getStartDate());
        club.setEndDate(clubDTO.getEndDate());
        club.setStudentDetails(sD);
        return Mono.just(clubRepository.save(club));
      });
  }

  public void deleteClub(UUID clubId){
    clubRepository.deleteById(clubId);
  }
}
