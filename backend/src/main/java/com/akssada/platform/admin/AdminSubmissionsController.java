package com.akssada.platform.admin;

import com.akssada.platform.contact.ContactRepository;
import com.akssada.platform.contact.ContactSubmission;
import com.akssada.platform.partnership.PartnershipInquiry;
import com.akssada.platform.partnership.PartnershipRepository;
import com.akssada.platform.volunteer.VolunteerApplication;
import com.akssada.platform.volunteer.VolunteerRepository;
import org.springframework.web.bind.annotation.GetMapping;
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
}
