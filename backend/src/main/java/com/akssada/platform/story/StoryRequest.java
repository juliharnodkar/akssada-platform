package com.akssada.platform.story;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record StoryRequest(
        @NotBlank @Size(max = 255) String title,
        @NotBlank @Size(max = 255) String slug,
        @NotBlank String content,
        String authorName,
        String category,
        String coverImageUrl,
        List<String> additionalImageUrls,
        UUID initiativeId,
        boolean published
) {}
