package com.senior.project.backend.skills;

import com.senior.project.backend.domain.Skill;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, UUID> {
  List<Skill> findByStudentDetailsId(UUID studentDetailsId);

  void deleteByStudentDetailsId(UUID studentDetailsId);
}
