package com.akssada.platform.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 255)
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Must be a valid email")
        @Size(max = 255)
        String email,

        @NotBlank(message = "Subject is required")
        @Size(max = 255)
        String subject,

        @NotBlank(message = "Message is required")
        String message
) {
}
