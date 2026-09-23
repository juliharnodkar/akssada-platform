package com.akssada.platform.story;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record StoryDetailDto(
        UUID id,
        String title,
        String slug,
        String content,
        String authorName,
        String category,
        String coverImageUrl,
        List<String> additionalImageUrls,
        String initiativeSlug,
        boolean published,
        OffsetDateTime publishedAt,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt) {

    public static StoryDetailDto from(Story story) {
        return new StoryDetailDto(
                story.getId(),
                story.getTitle(),
                story.getSlug(),
                story.getContent(),
                story.getAuthorName(),
                story.getCategory(),
                story.getCoverImageUrl(),
                story.getAdditionalImageUrls(),
                story.getInitiative() != null ? story.getInitiative().getSlug() : null,
                story.isPublished(),
                story.getPublishedAt(),
                story.getCreatedAt(),
                story.getUpdatedAt());
    }
}
