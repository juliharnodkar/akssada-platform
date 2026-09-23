package com.akssada.platform.partnership;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/partnership")
public class PartnershipController {

    private final PartnershipRepository partnershipRepository;

    public PartnershipController(PartnershipRepository partnershipRepository) {
        this.partnershipRepository = partnershipRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> submitPartnership(@Valid @RequestBody PartnershipRequest request) {
        PartnershipInquiry inquiry = new PartnershipInquiry(
                request.organizationName(),
                request.contactName(),
                request.email(),
                request.phone(),
                request.partnershipType(),
                request.message()
        );
        partnershipRepository.save(inquiry);
        return ResponseEntity.ok(Map.of("message", "Partnership inquiry received"));
    }
}
