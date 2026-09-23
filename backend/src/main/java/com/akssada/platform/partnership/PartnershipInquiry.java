package com.akssada.platform.partnership;

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
@Table(name = "partnership_inquiry")
public class PartnershipInquiry {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(name = "organization_name", nullable = false)
    private String organizationName;

    @Column(name = "contact_name", nullable = false)
    private String contactName;

    @Column(nullable = false)
    private String email;

    private String phone;

    @Column(name = "partnership_type", nullable = false)
    private String partnershipType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private String status;

    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private OffsetDateTime submittedAt;

    protected PartnershipInquiry() {
        // required by JPA
    }

    public PartnershipInquiry(
            String organizationName,
            String contactName,
            String email,
            String phone,
            String partnershipType,
            String message) {
        this.organizationName = organizationName;
        this.contactName = contactName;
        this.email = email;
        this.phone = phone;
        this.partnershipType = partnershipType;
        this.message = message;
        this.status = "NEW";
    }

    public UUID getId() {
        return id;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public String getContactName() {
        return contactName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getPartnershipType() {
        return partnershipType;
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

