package com.senior.project.backend.Activity;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.nio.ByteBuffer;
import java.util.Map;
import java.util.UUID;

@Component
public class EventTrackingHandler {
    private final EventTrackingService eventTrackingService;
    private static final ObjectMapper MAPPER = new ObjectMapper();

    public EventTrackingHandler(EventTrackingService eventTrackingService) {
        this.eventTrackingService = eventTrackingService;
    }

    public Mono<ServerResponse> save(ServerRequest request) {
        return request.bodyToMono(String.class)
                .flatMap(body -> {
                    try {
                        return processEventTracking(body);
                    } catch (Exception e) {
                        return handleError(e);
                    }
                });
    }

    public Mono<ServerResponse> getInterestStatus(ServerRequest request) {
        try {
            Long eventId = Long.valueOf(request.queryParam("eventId").orElseThrow());
            UUID userId = UUID.fromString(request.queryParam("userId").orElseThrow());
            byte[] userIdBytes = convertUuidToBytes(userId);

            return eventTrackingService.getInterest(eventId, userIdBytes)
                    .flatMap(isInterested -> ServerResponse.ok()
                            .contentType(MediaType.APPLICATION_JSON)
                            .bodyValue(Map.of(
                                    "success", true,
                                    "isInterested", isInterested
                            )))
                    .switchIfEmpty(ServerResponse.ok()
                            .contentType(MediaType.APPLICATION_JSON)
                            .bodyValue(Map.of(
                                    "success", true,
                                    "isInterested", false
                            )));
        } catch (Exception e) {
            return handleError(e);
        }
    }


    private Mono<ServerResponse> processEventTracking(String body) throws Exception {
        Map<String, Object> data = MAPPER.readValue(body, new TypeReference<>() {});

        Long eventId = Long.valueOf(data.get("eventId").toString());
        UUID userId = UUID.fromString(data.get("userId").toString());
        Boolean isInterested = (Boolean) data.get("isInterested");

        byte[] userIdBytes = convertUuidToBytes(userId);

        return eventTrackingService.saveOrUpdate(eventId, userIdBytes, isInterested)
                .flatMap(result -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(Map.of(
                                "success", true,
                                "message", "Event tracking updated successfully",
                                "isInterested", isInterested
                        )));
    }

    private Mono<ServerResponse> handleError(Throwable e) {
        e.printStackTrace();
        return ServerResponse.badRequest().bodyValue(Map.of(
                "success", false,
                "error", "Failed to process request: " + e.getMessage()
        ));
    }

    private byte[] convertUuidToBytes(UUID uuid) {
        ByteBuffer bb = ByteBuffer.wrap(new byte[16]);
        bb.putLong(uuid.getMostSignificantBits());
        bb.putLong(uuid.getLeastSignificantBits());
        return bb.array();
    }
}