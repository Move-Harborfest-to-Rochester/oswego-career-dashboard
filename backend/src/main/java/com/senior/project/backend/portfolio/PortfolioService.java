package com.senior.project.backend.portfolio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senior.project.backend.domain.Job;
import com.senior.project.backend.job.JobRepository;
import com.senior.project.backend.security.CurrentUserUtil;

import reactor.core.publisher.Mono;

@Service
public class PortfolioService {
    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private CurrentUserUtil currentUserUtil;

    public Mono<Job> saveJob(JobDTO jobDTO) {
        return currentUserUtil.getCurrentUser().flatMap(user -> {
            Job job = new Job();
            job.setName(jobDTO.getName());
            job.setDescription(jobDTO.getDescription());
            job.setLocation(jobDTO.getLocation());
            job.setCoop(jobDTO.isCoop());
            job.setStartDate(jobDTO.getStartDate());
            job.setEndDate(jobDTO.getEndDate());
            job.setStudentDetails(user.getStudentDetails());
            return Mono.just(jobRepository.save(job));
        });
    }
}
