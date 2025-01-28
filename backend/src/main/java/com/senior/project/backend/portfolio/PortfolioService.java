package com.senior.project.backend.portfolio;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.github.fge.jsonpatch.JsonPatch;
import com.senior.project.backend.domain.Skill;
import com.senior.project.backend.portfolio.dto.SkillDTO;
import com.senior.project.backend.skills.SkillRepository;
import com.senior.project.backend.degreeprogram.DegreeProgramRepository;
import com.senior.project.backend.domain.DegreeProgram;
import com.senior.project.backend.domain.StudentDetails;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.portfolio.dto.DegreeProgramOperation;
import com.senior.project.backend.portfolio.dto.EditEducationDTO;
import com.senior.project.backend.portfolio.dto.EducationDTO;
import com.senior.project.backend.portfolio.dto.PersonalInfoDTO;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.studentdetails.StudentDetailsRepository;
import com.senior.project.backend.users.UserRepository;

import jakarta.transaction.Transactional;

import com.senior.project.backend.portfolio.dto.OperationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PortfolioService {

  @Autowired
  private CurrentUserUtil currentUserUtil;

  @Autowired
  private SkillRepository skillRepository;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private StudentDetailsRepository studentDetailsRepository;

  @Autowired
  private DegreeProgramRepository degreeProgramRepository;

  @Autowired
  private UserRepository userRepository;

  public Mono<PersonalInfoDTO> savePersonalInfo(PersonalInfoDTO dto) {
    return currentUserUtil.getCurrentUser()
        .flatMap(user -> {
          UUID userId = user.getId();
          return getOrCreateStudentDetails()
              .flatMap(studentDetails -> {
                UUID studentDetailsId = studentDetails.getId();
                updateStudentDetails(studentDetailsId, dto);
                updateUser(userId, dto);
                return Mono.just(dto);
              });
        });
  }

  private Mono<StudentDetails> getOrCreateStudentDetails() {
    return currentUserUtil.getCurrentUser()
        .flatMap(user -> {
          if (user.getStudentDetails() == null) {
            StudentDetails newStudentDetails = new StudentDetails();
            studentDetailsRepository.save(newStudentDetails);
            user.setStudentDetails(newStudentDetails);
            userRepository.save(user);
          }
          return Mono.just(user.getStudentDetails());
        });
  }

  private void updateStudentDetails(UUID studentDetailsId, PersonalInfoDTO dto) {
    studentDetailsRepository.updateDescription(studentDetailsId, dto.getDescription());
  }

  private void updateUser(UUID userId, PersonalInfoDTO dto) {
    userRepository.updatePersonalInfo(userId, dto);
  }

    public Mono<EducationDTO> saveEducation(EditEducationDTO educationDTO) {
        return currentUserUtil.getCurrentUser()
                .flatMap(user -> {
                    this.updateStudentDetails(user, educationDTO);
                    this.updateDegreePrograms(user, educationDTO);
                    StudentDetails studentDetails = user.getStudentDetails();
                    EducationDTO response = EducationDTO.builder()
                            .universityId(studentDetails.getUniversityId())
                            .gpa(studentDetails.getGpa())
                            .year(studentDetails.getYearLevel())
                            .majors(studentDetails.getDegreePrograms().stream()
                                    .filter(degreeProgram -> !degreeProgram.isMinor())
                                    .toList()
                            )
                            .minors(studentDetails.getDegreePrograms().stream()
                                    .filter(DegreeProgram::isMinor)
                                    .toList()
                            )
                            .build();
                    return Mono.just(response);
                });
    }

  private void updateStudentDetails(User user, EditEducationDTO educationDTO) {
    StudentDetails userStudentDetails = user.getStudentDetails();
    StudentDetails studentDetails = userStudentDetails != null ? userStudentDetails : new StudentDetails();
    studentDetails.setUniversityId(educationDTO.getUniversityId());
    studentDetails.setGpa(educationDTO.getGpa());
    studentDetails.setYearLevel(educationDTO.getYear());
    studentDetailsRepository.save(studentDetails);
    user.setStudentDetails(studentDetails);
    if (userStudentDetails == null) {
      userRepository.save(user);
    }
  }

  private void updateDegreePrograms(User user, EditEducationDTO educationDTO) {
    List<DegreeProgram> programsToSave = new ArrayList<>();
    List<UUID> programsToDelete = new ArrayList<>();

    for (DegreeProgramOperation operation : educationDTO.getDegreeProgramOperations()) {
      if (operation.getOperation().equals(OperationType.Delete)) {
        programsToDelete.add(operation.getId());
      } else {
        programsToSave.add(operation.toDegreeProgram(user.getStudentDetails()));
      }
    }

    degreeProgramRepository.saveAll(programsToSave);
    degreeProgramRepository.deleteAllById(programsToDelete);
    user.getStudentDetails().setDegreePrograms(programsToSave);
  }

  public Mono<StudentDetails> patchStudentDetails(JsonPatch patch) {
    return getOrCreateStudentDetails()
        .flatMap(studentDetails -> {
          JsonNode studentJson = objectMapper.convertValue(studentDetails, JsonNode.class);
          try {
            JsonNode patchedStudentJson = patch.apply(studentJson);
            StudentDetails patchedStudent = objectMapper.treeToValue(patchedStudentJson, StudentDetails.class);
            if (patchedStudent.getSkills() != null) {
              patchedStudent.getSkills().forEach(skill -> skill.setStudentDetails(studentDetails));
            }
            if (patchedStudent.getInterests() != null) {
              patchedStudent.getInterests().forEach(interest -> interest.setStudentDetails(studentDetails));
            }
            return Mono.just(studentDetailsRepository.save(patchedStudent));
          } catch (Exception e) {
            return Mono.error(new IllegalArgumentException("Invalid patch operation", e));
          }
        });
  }
}
