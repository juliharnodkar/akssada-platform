package com.akssada.platform.initiative;

/**
 * Shape returned by the initiatives list endpoint. Deliberately omits the
 * full {@code content} body, which is only needed on the detail page.
 */
public record InitiativeSummaryDto(
        String title,
        String slug,
        String focusArea,
        String summary,
        String coverImageUrl) {

    public static InitiativeSummaryDto from(Initiative initiative) {
        return new InitiativeSummaryDto(
                initiative.getTitle(),
                initiative.getSlug(),
                initiative.getFocusArea(),
                initiative.getSummary(),
                initiative.getCoverImageUrl());
    }
}
