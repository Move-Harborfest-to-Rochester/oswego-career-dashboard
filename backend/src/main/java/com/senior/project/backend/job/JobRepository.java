package com.senior.project.backend.job;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.senior.project.backend.domain.Job;

public interface JobRepository extends JpaRepository<Job, UUID> {
}
