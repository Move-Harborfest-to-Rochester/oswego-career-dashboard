package com.senior.project.backend.portfolio;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.fasterxml.jackson.core.type.TypeReference;
import com.senior.project.backend.domain.Skill;
import com.senior.project.backend.portfolio.dto.SkillDTO;
import com.senior.project.backend.skills.SkillRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senior.project.backend.degreeprogram.DegreeProgramRepository;
import com.senior.project.backend.domain.DegreeProgram;
import com.senior.project.backend.domain.StudentDetails;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.portfolio.dto.DegreeProgramOperation;
import com.senior.project.backend.portfolio.dto.EducationDTO;
import com.senior.project.backend.portfolio.dto.OperationType;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.studentdetails.StudentDetailsRepository;

import reactor.core.publisher.Mono;;

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


    public Mono<StudentDetails> patchSkills(UUID studentId, JsonPatch patch) {
        return Mono.justOrEmpty(studentDetailsRepository.findById(studentId))
            .flatMap(studentDetails -> {
                List<Skill> currentSkills = skillRepository.findByStudentDetailsId(studentId);
                JsonNode skillsJson = objectMapper.convertValue(currentSkills, JsonNode.class);
                try {
                    JsonNode patchedSkillsJson = patch.apply(skillsJson);
                    List<Skill> patchedSkills = objectMapper.readValue(
                        patchedSkillsJson.traverse(),
                        new TypeReference<List<Skill>>() {}
                    );
                    skillRepository.deleteById(studentId);
                    skillRepository.saveAll(patchedSkills);
                    return Mono.justOrEmpty(studentDetailsRepository.findById(studentId));
                } catch (Exception e) {
                    return Mono.error(new IllegalArgumentException("Invalid patch operation", e));
                }
            });
    }


    public Mono<StudentDetails> patchStudentDetails(UUID studentId, JsonPatch patch) {
        return Mono.justOrEmpty(studentDetailsRepository.findById(studentId))
            .flatMap(studentDetails -> {
                JsonNode studentJson = objectMapper.convertValue(studentDetails, JsonNode.class);
                try {
                    // Apply the patch to the whole student details object, including skills
                    JsonNode patchedStudentJson = patch.apply(studentJson);

                    // Deserialize the patched object back to StudentDetails
                    StudentDetails patchedStudent = objectMapper.treeToValue(patchedStudentJson, StudentDetails.class);

                    // Ensure each Skill object has the correct StudentDetails reference
                    if (patchedStudent.getSkills() != null) {
                        patchedStudent.getSkills().forEach(skill -> skill.setStudentDetails(studentDetails));
                    }

                    // Save the updated StudentDetails object (with skills correctly linked)
                    return Mono.just(studentDetailsRepository.save(patchedStudent));
                } catch (Exception e) {
                    return Mono.error(new IllegalArgumentException("Invalid patch operation", e));
                }
            });
    }






    public Mono<User> saveEducation(EducationDTO educationDTO) {
        return currentUserUtil.getCurrentUser()
                .flatMap(user -> {
                    this.updateStudentDetails(user, educationDTO);
                    this.updateDegreePrograms(user, educationDTO);
                    return Mono.just(user);
                });
    }

    private void updateStudentDetails(User user, EducationDTO educationDTO) {
        StudentDetails studentDetails = user.getStudentDetails();
        studentDetails.setUniversityId(educationDTO.getUniversityId());
        studentDetails.setGpa(educationDTO.getGpa());
        studentDetails.setYearLevel(educationDTO.getYear());
        studentDetails = studentDetailsRepository.save(studentDetails);
        user.setStudentDetails(studentDetails);
    }

    private void updateDegreePrograms(User user, EducationDTO educationDTO) {
        List<DegreeProgram> programsToSave = new ArrayList<>();
        List<UUID> programsToDelete = new ArrayList<>();

        for (DegreeProgramOperation degreeProgramOperation : educationDTO.getDegreeProgramOperations()) {
            if (degreeProgramOperation.getOperation().equals(OperationType.Delete)) {
                programsToDelete.add(degreeProgramOperation.getId());
            } else {
                programsToSave.add(degreeProgramOperation.toDegreeProgram(user.getStudentDetails()));
            }
        }

        degreeProgramRepository.saveAll(programsToSave);
        degreeProgramRepository.deleteAllById(programsToDelete);

        StudentDetails studentDetails = user.getStudentDetails();
        studentDetails.setDegreePrograms(programsToSave);
        user.setStudentDetails(studentDetails);
    }
}
