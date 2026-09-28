package com.akssada.platform.admin;

import com.akssada.platform.contact.ContactRepository;
import com.akssada.platform.contact.ContactSubmission;
import com.akssada.platform.partnership.PartnershipInquiry;
import com.akssada.platform.partnership.PartnershipRepository;
import com.akssada.platform.volunteer.VolunteerApplication;
import com.akssada.platform.volunteer.VolunteerRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/submissions")
public class AdminSubmissionsController {

    private final ContactRepository contactRepository;
    private final VolunteerRepository volunteerRepository;
    private final PartnershipRepository partnershipRepository;

    public AdminSubmissionsController(
            ContactRepository contactRepository,
            VolunteerRepository volunteerRepository,
            PartnershipRepository partnershipRepository) {
        this.contactRepository = contactRepository;
        this.volunteerRepository = volunteerRepository;
        this.partnershipRepository = partnershipRepository;
    }

    @GetMapping("/contact")
    public List<ContactSubmission> listContact() {
        return contactRepository.findAll();
    }

    @GetMapping("/volunteer")
    public List<VolunteerApplication> listVolunteer() {
        return volunteerRepository.findAll();
    }

    @GetMapping("/partnership")
    public List<PartnershipInquiry> listPartnership() {
        return partnershipRepository.findAll();
    }

    @PutMapping("/contact/{id}/status")
    public void updateContactStatus(@org.springframework.web.bind.annotation.PathVariable java.util.UUID id, @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> body) {
        contactRepository.findById(id).ifPresent(s -> {
            s.setStatus(body.get("status"));
            contactRepository.save(s);
        });
    }

    @DeleteMapping("/contact/{id}")
    public void deleteContact(@org.springframework.web.bind.annotation.PathVariable java.util.UUID id) {
        contactRepository.deleteById(id);
    }

    @PutMapping("/volunteer/{id}/status")
    public void updateVolunteerStatus(@org.springframework.web.bind.annotation.PathVariable java.util.UUID id, @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> body) {
        volunteerRepository.findById(id).ifPresent(s -> {
            s.setStatus(body.get("status"));
            volunteerRepository.save(s);
        });
    }

    @DeleteMapping("/volunteer/{id}")
    public void deleteVolunteer(@org.springframework.web.bind.annotation.PathVariable java.util.UUID id) {
        volunteerRepository.deleteById(id);
    }

    @PutMapping("/partnership/{id}/status")
    public void updatePartnershipStatus(@org.springframework.web.bind.annotation.PathVariable java.util.UUID id, @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> body) {
        partnershipRepository.findById(id).ifPresent(s -> {
            s.setStatus(body.get("status"));
            partnershipRepository.save(s);
        });
    }

    @DeleteMapping("/partnership/{id}")
    public void deletePartnership(@org.springframework.web.bind.annotation.PathVariable java.util.UUID id) {
        partnershipRepository.deleteById(id);
    }
}
