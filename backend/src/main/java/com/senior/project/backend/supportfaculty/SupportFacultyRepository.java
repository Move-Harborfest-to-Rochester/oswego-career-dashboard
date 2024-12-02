package com.senior.project.backend.supportfaculty;

import com.senior.project.backend.domain.SupportFaculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SupportFacultyRepository extends JpaRepository<SupportFaculty, UUID> {
}
