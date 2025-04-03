package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.EventTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventTrackingRepository extends JpaRepository<EventTracking, Long> {

    // Find event tracking record by specific event and user
    @Query("SELECT et FROM EventTracking et WHERE et.eventId = :eventId AND et.userId = :userId")
    List<EventTracking> findByEventIdAndUserId(@Param("eventId") Long eventId, @Param("userId") byte[] userId);

}