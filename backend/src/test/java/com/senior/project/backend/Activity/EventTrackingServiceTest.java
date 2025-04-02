package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.EventTracking;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EventTrackingServiceTest {

    @InjectMocks
    private EventTrackingService eventTrackingService;

    @Mock
    private EventTrackingRepository eventTrackingRepository;

    private final UUID testUserId = UUID.randomUUID();
    private final Long testEventId = 1L;
    private byte[] userIdBytes;

    @BeforeEach
    public void setup() {
        ByteBuffer bb = ByteBuffer.wrap(new byte[16]);
        bb.putLong(testUserId.getMostSignificantBits());
        bb.putLong(testUserId.getLeastSignificantBits());
        userIdBytes = bb.array();
    }

    @Test
    public void testGetInterestRecordExists() {
        EventTracking eventTracking = new EventTracking();
        eventTracking.setEventId(testEventId);
        eventTracking.setUserId(userIdBytes);
        eventTracking.setInterested(true);

        List<EventTracking> trackingList = new ArrayList<>();
        trackingList.add(eventTracking);

        when(eventTrackingRepository.findByEventIdAndUserId(testEventId, userIdBytes)).thenReturn(trackingList);

        Mono<Boolean> result = eventTrackingService.getInterest(testEventId, userIdBytes);

        StepVerifier.create(result)
                .expectNext(true)
                .verifyComplete();

        verify(eventTrackingRepository, times(1)).findByEventIdAndUserId(testEventId, userIdBytes);
    }

    @Test
    public void testGetInterestRecordDoesNotExist() {
        when(eventTrackingRepository.findByEventIdAndUserId(testEventId, userIdBytes)).thenReturn(new ArrayList<>());

        Mono<Boolean> result = eventTrackingService.getInterest(testEventId, userIdBytes);

        StepVerifier.create(result)
                .expectNext(false)
                .verifyComplete();

        verify(eventTrackingRepository, times(1)).findByEventIdAndUserId(testEventId, userIdBytes);
    }

    @Test
    public void testGetInterestNotInterested() {
        EventTracking eventTracking = new EventTracking();
        eventTracking.setEventId(testEventId);
        eventTracking.setUserId(userIdBytes);
        eventTracking.setInterested(false);

        List<EventTracking> trackingList = new ArrayList<>();
        trackingList.add(eventTracking);

        when(eventTrackingRepository.findByEventIdAndUserId(testEventId, userIdBytes)).thenReturn(trackingList);

        Mono<Boolean> result = eventTrackingService.getInterest(testEventId, userIdBytes);

        StepVerifier.create(result)
                .expectNext(false)
                .verifyComplete();

        verify(eventTrackingRepository, times(1)).findByEventIdAndUserId(testEventId, userIdBytes);
    }

    @Test
    public void testSaveOrUpdateNewRecord() {
        when(eventTrackingRepository.findByEventIdAndUserId(testEventId, userIdBytes)).thenReturn(new ArrayList<>());
        when(eventTrackingRepository.save(any(EventTracking.class))).thenReturn(new EventTracking());

        Mono<Boolean> result = eventTrackingService.saveOrUpdate(testEventId, userIdBytes, true);

        StepVerifier.create(result)
                .expectNext(true)
                .verifyComplete();

        verify(eventTrackingRepository, times(1)).findByEventIdAndUserId(testEventId, userIdBytes);
        verify(eventTrackingRepository, times(1)).save(any(EventTracking.class));
    }

    @Test
    public void testSaveOrUpdateExistingRecord() {
        EventTracking existingTracking = new EventTracking();
        existingTracking.setEventId(testEventId);
        existingTracking.setUserId(userIdBytes);
        existingTracking.setInterested(false);

        List<EventTracking> trackingList = new ArrayList<>();
        trackingList.add(existingTracking);

        when(eventTrackingRepository.findByEventIdAndUserId(testEventId, userIdBytes)).thenReturn(trackingList);
        when(eventTrackingRepository.save(any(EventTracking.class))).thenReturn(existingTracking);

        Mono<Boolean> result = eventTrackingService.saveOrUpdate(testEventId, userIdBytes, true);

        StepVerifier.create(result)
                .expectNext(true)
                .verifyComplete();

        verify(eventTrackingRepository, times(1)).findByEventIdAndUserId(testEventId, userIdBytes);
        verify(eventTrackingRepository, times(1)).save(any(EventTracking.class));
    }

    @Test
    public void testSaveOrUpdateToggleInterest() {
        EventTracking existingTracking = new EventTracking();
        existingTracking.setEventId(testEventId);
        existingTracking.setUserId(userIdBytes);
        existingTracking.setInterested(true); // Initially interested

        List<EventTracking> trackingList = new ArrayList<>();
        trackingList.add(existingTracking);

        when(eventTrackingRepository.findByEventIdAndUserId(testEventId, userIdBytes)).thenReturn(trackingList);
        when(eventTrackingRepository.save(any(EventTracking.class))).thenReturn(existingTracking);

        Mono<Boolean> result = eventTrackingService.saveOrUpdate(testEventId, userIdBytes, false);

        StepVerifier.create(result)
                .expectNext(true)
                .verifyComplete();

        verify(eventTrackingRepository, times(1)).findByEventIdAndUserId(testEventId, userIdBytes);
        verify(eventTrackingRepository, times(1)).save(any(EventTracking.class));
    }
}