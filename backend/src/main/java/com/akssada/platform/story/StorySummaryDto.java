package com.akssada.platform.story;

import java.time.OffsetDateTime;

public record StorySummaryDto(
        String title,
        String slug,
        String authorName,
        String category,
        String coverImageUrl,
        String initiativeSlug,
        OffsetDateTime publishedAt) {

    public static StorySummaryDto from(Story story) {
        return new StorySummaryDto(
                story.getTitle(),
                story.getSlug(),
                story.getAuthorName(),
                story.getCategory(),
                story.getCoverImageUrl(),
                story.getInitiative() != null ? story.getInitiative().getSlug() : null,
                story.getPublishedAt());
    }
}
