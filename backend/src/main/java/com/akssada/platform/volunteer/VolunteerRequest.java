package com.akssada.platform.volunteer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VolunteerRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 255)
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Must be a valid email")
        @Size(max = 255)
        String email,

        @NotBlank(message = "Phone is required")
        @Size(max = 50)
        String phone,

        @NotBlank(message = "Location is required")
        @Size(max = 255)
        String location,

        String skills,

        String areasOfInterest,

        String availability,

        String message
) {
}
