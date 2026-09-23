package com.akssada.platform.initiative;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record InitiativeRequest(
        @NotBlank @Size(max = 255) String title,
        @NotBlank @Size(max = 255) String slug,
        @NotBlank @Size(max = 100) String focusArea,
        @NotBlank String summary,
        @NotBlank String content,
        String coverImageUrl,
        boolean published
) {}
