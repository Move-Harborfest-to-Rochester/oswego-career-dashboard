package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for Milestones
 */
@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    // additional query methods if needed

    @Query("SELECT m FROM Milestone m LEFT JOIN FETCH m.tasks")
    List<Milestone> findAllWithTasks();

    Milestone findById(long id);


    @Query("""
            SELECT m
            FROM Milestone m
            WHERE NOT EXISTS (
                SELECT t
                FROM Task t
                WHERE t.milestone = m
                AND NOT EXISTS (
                    SELECT s
                    FROM Submission s
                    WHERE s.taskId = t.id
                    AND s.studentId = :uid
                )
            )""")
    List<Milestone> findComplete(@Param("uid") UUID userId);

}
