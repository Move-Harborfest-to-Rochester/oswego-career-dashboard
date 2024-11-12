package com.senior.project.backend.studentdetails;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.senior.project.backend.domain.StudentDetails;

@Repository
public interface StudentDetailsRepository extends JpaRepository<StudentDetails, UUID> {
    @Modifying
    @Transactional
    @Query("UPDATE StudentDetails sd SET sd.description = :description WHERE sd.id = :id")
    void updateDescription(UUID id, String description);

}

