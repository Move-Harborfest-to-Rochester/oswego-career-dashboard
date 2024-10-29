package com.senior.project.backend.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

import com.senior.project.backend.domain.Project;
import com.senior.project.backend.domain.StudentDetails;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.studentdetails.StudentDetailsRepository;
import com.senior.project.backend.users.UserRepository;

import reactor.core.publisher.Mono;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private StudentDetailsRepository studentDetailsRepository;
    @Autowired
    private UserRepository userRepository;
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

    public Mono<Project> saveProject(ProjectDTO projectDTO) {
        return currentUserUtil.getCurrentUser().flatMap(user -> {
            StudentDetails studentDetails = getOrCreateStudentDetails(user);
            Project project = new Project();
            if (projectDTO.getId() != null) {
                project.setId(projectDTO.getId());
            }
            project.setName(projectDTO.getName());
            project.setDescription(projectDTO.getDescription());
            project.setStartDate(projectDTO.getStartDate());
            project.setEndDate(projectDTO.getEndDate());
            project.setStudentDetails(studentDetails);
            return Mono.just(projectRepository.save(project));
        });
    }
    public void deleteProject(UUID id)
        projectRepository.deletebyID(id)
}