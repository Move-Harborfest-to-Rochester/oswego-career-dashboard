package com.senior.project.backend.basacoffice;

import com.senior.project.backend.domain.BasacOfficeFaculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BasacOfficeFacultyRepository extends JpaRepository<BasacOfficeFaculty, UUID> {
}