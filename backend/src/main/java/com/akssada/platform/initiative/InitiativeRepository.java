package com.akssada.platform.initiative;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InitiativeRepository extends JpaRepository<Initiative, UUID> {

    List<Initiative> findAllByPublishedTrueOrderByCreatedAtDesc();

    Optional<Initiative> findBySlugAndPublishedTrue(String slug);
}
