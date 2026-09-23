package com.akssada.platform.initiative;

import java.time.OffsetDateTime;
import java.util.UUID;

public record InitiativeDetailDto(
        UUID id,
        String title,
        String slug,
        String focusArea,
        String summary,
        String content,
        String coverImageUrl,
        boolean published,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt) {

    public static InitiativeDetailDto from(Initiative initiative) {
        return new InitiativeDetailDto(
                initiative.getId(),
                initiative.getTitle(),
                initiative.getSlug(),
                initiative.getFocusArea(),
                initiative.getSummary(),
                initiative.getContent(),
                initiative.getCoverImageUrl(),
                initiative.isPublished(),
                initiative.getCreatedAt(),
                initiative.getUpdatedAt());
    }
}
