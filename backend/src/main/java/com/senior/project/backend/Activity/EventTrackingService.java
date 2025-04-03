package com.senior.project.backend.Activity;

import com.senior.project.backend.util.NonBlockingExecutor;
import com.senior.project.backend.domain.EventTracking;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.util.Date;
import java.util.List;

@Service
public class EventTrackingService {
    private final EventTrackingRepository eventTrackingRepository;

    public EventTrackingService(EventTrackingRepository eventTrackingRepository) {
        this.eventTrackingRepository = eventTrackingRepository;
    }

    /**
     * Gets event tracking record
     */
    public Mono<Boolean> getInterest(Long eventId, byte[] userId) {
        return NonBlockingExecutor.execute(() -> {
            List<EventTracking> existingList = eventTrackingRepository.findByEventIdAndUserId(eventId, userId);
            return !existingList.isEmpty() && existingList.get(0).isInterested();
        });
    }


    /**
     * Saves or updates an event tracking record, updates on timestamp
     */
    public Mono<Boolean> saveOrUpdate(Long eventId, byte[] userId, boolean isInterested) {
        return NonBlockingExecutor.execute(() -> {
            List<EventTracking> existingList = eventTrackingRepository.findByEventIdAndUserId(eventId, userId);

            EventTracking tracking = existingList.isEmpty()
                    ? new EventTracking()
                    : existingList.get(0);

            tracking.setEventId(eventId);
            tracking.setUserId(userId);
            tracking.setInterested(isInterested);
            tracking.setDateCreated(new Date());

            eventTrackingRepository.save(tracking);
            return true;
        });
    }
}