package com.akssada.platform.volunteer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "volunteer_application")
public class VolunteerApplication {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String location;

    private String skills;

    @Column(name = "areas_of_interest")
    private String areasOfInterest;

    private String availability;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private String status;

    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private OffsetDateTime submittedAt;

    protected VolunteerApplication() {
        // required by JPA
    }

    public VolunteerApplication(
            String name,
            String email,
            String phone,
            String location,
            String skills,
            String areasOfInterest,
            String availability,
            String message) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.location = location;
        this.skills = skills;
        this.areasOfInterest = areasOfInterest;
        this.availability = availability;
        this.message = message;
        this.status = "NEW";
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getLocation() {
        return location;
    }

    public String getSkills() {
        return skills;
    }

    public String getAreasOfInterest() {
        return areasOfInterest;
    }

    public String getAvailability() {
        return availability;
    }

    public String getMessage() {
        return message;
    }

    public String getStatus() {
        return status;
    }

    public OffsetDateTime getSubmittedAt() {
        return submittedAt;
    }
}

