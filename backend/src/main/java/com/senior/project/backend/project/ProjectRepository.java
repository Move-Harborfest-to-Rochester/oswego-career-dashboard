package com.senior.project.backend.project;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.senior.project.backend.domain.Project;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
}