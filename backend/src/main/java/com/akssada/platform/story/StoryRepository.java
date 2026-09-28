package com.akssada.platform.story;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoryRepository extends JpaRepository<Story, UUID> {

    List<Story> findAllByPublishedTrueOrderByPublishedAtDesc();

    List<Story> findAllByOrderByCreatedAtDesc();

    Optional<Story> findBySlugAndPublishedTrue(String slug);
}
