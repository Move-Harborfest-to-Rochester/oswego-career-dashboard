package com.senior.project.backend.clubs;

import com.senior.project.backend.domain.Club;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubRepository extends JpaRepository<Club, UUID> {

}
