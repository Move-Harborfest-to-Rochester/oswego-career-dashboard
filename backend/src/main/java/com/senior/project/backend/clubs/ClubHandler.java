package com.senior.project.backend.clubs;


import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class ClubHandler {
  @Autowired
  private ClubService clubService;


  public Mono<ServerResponse> saveClub(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(ClubDTO.class)
            .flatMap(clubService::saveClub)
            .flatMap(club -> ServerResponse.ok().bodyValue(club));
  }

  public Mono<ServerResponse> deleteClub(ServerRequest request) {
    UUID id = UUID.fromString(request.pathVariable("id"));
    clubService.deleteClub(id);
    return ServerResponse.noContent().build();
  }

}
