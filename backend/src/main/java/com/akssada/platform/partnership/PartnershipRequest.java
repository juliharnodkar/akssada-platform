package com.akssada.platform.partnership;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PartnershipRequest(
        @NotBlank(message = "Organization name is required")
        @Size(max = 255)
        String organizationName,

        @NotBlank(message = "Contact name is required")
        @Size(max = 255)
        String contactName,

        @NotBlank(message = "Email is required")
        @Email(message = "Must be a valid email")
        @Size(max = 255)
        String email,

        String phone,

        @NotBlank(message = "Partnership type is required")
        @Size(max = 255)
        String partnershipType,

        @NotBlank(message = "Message is required")
        String message
) {
}
