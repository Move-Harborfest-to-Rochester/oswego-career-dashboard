package com.senior.project.backend.job;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senior.project.backend.domain.Job;
import com.senior.project.backend.domain.StudentDetails;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.studentdetails.StudentDetailsRepository;
import com.senior.project.backend.users.UserRepository;

import reactor.core.publisher.Mono;

@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;
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

    public Mono<Job> saveJob(JobDTO jobDTO) {
        // TODO: Verify that the user has permission to edit this job, if it exists
        return currentUserUtil.getCurrentUser().flatMap(user -> {
            StudentDetails studentDetails = getOrCreateStudentDetails(user);
            Job job = new Job();
            if (jobDTO.getId() != null) {
                job.setId(jobDTO.getId());
            }
            job.setName(jobDTO.getName());
            job.setDescription(jobDTO.getDescription());
            job.setLocation(jobDTO.getLocation());
            job.setCoop(jobDTO.isCoop());
            job.setStartDate(jobDTO.getStartDate());
            job.setEndDate(jobDTO.getEndDate());
            job.setStudentDetails(studentDetails);
            return Mono.just(jobRepository.save(job));
        });
    }

    public void deleteJob(UUID id) {
        // TODO: Verify that the user has permission to delete this job
        jobRepository.deleteById(id);
    }
}
