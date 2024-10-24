package com.senior.project.backend.portfolio;

import com.senior.project.backend.domain.StudentDetails;
import com.senior.project.backend.portfolio.dto.PersonalInfoDTO;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.studentdetails.StudentDetailsRepository;
import com.senior.project.backend.users.UserRepository;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Mono;

@Service
public class PortfolioService {
    @Autowired
    private CurrentUserUtil currentUserUtil;

    @Autowired
    private StudentDetailsRepository studentDetailsRepository;

    @Autowired
    private UserRepository userRepository;
    
    public Mono<PersonalInfoDTO> savePersonalInfo(PersonalInfoDTO dto) {
        currentUserUtil.getCurrentUser()
                .flatMap(user -> {
                    UUID userId = user.getId();
                    StudentDetails studentDetails = user.getStudentDetails();
                    UUID studentDetailsId = studentDetails.getId();
                    this.updateStudentDetails(studentDetailsId, dto);
                    this.updateUser(userId, dto);
                    return Mono.just(dto);
                });
        return Mono.just(dto);
    }

    private void updateStudentDetails(UUID studentDetailsId, PersonalInfoDTO dto) {
        studentDetailsRepository.updateDescription(studentDetailsId, dto.getDescription());
    }

    private void updateUser(UUID userId, PersonalInfoDTO dto) {
        userRepository.updatePersonalInfo(userId, dto);
    }
}
