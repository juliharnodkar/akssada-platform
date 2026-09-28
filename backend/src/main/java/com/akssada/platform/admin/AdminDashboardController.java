package com.akssada.platform.admin;

import com.akssada.platform.contact.ContactRepository;
import com.akssada.platform.initiative.InitiativeRepository;
import com.akssada.platform.partnership.PartnershipRepository;
import com.akssada.platform.story.StoryRepository;
import com.akssada.platform.volunteer.VolunteerRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final StoryRepository storyRepository;
    private final InitiativeRepository initiativeRepository;
    private final ContactRepository contactRepository;
    private final VolunteerRepository volunteerRepository;
    private final PartnershipRepository partnershipRepository;

    public AdminDashboardController(
            StoryRepository storyRepository,
            InitiativeRepository initiativeRepository,
            ContactRepository contactRepository,
            VolunteerRepository volunteerRepository,
            PartnershipRepository partnershipRepository) {
        this.storyRepository = storyRepository;
        this.initiativeRepository = initiativeRepository;
        this.contactRepository = contactRepository;
        this.volunteerRepository = volunteerRepository;
        this.partnershipRepository = partnershipRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalStories = storyRepository.count();
        long publishedStories = storyRepository.findAllByPublishedTrueOrderByPublishedAtDesc().size();
        
        long totalInitiatives = initiativeRepository.count();
        long publishedInitiatives = initiativeRepository.findAllByPublishedTrueOrderByCreatedAtDesc().size();
        
        long totalEnquiries = contactRepository.count() + volunteerRepository.count() + partnershipRepository.count();
        
        stats.put("totalStories", totalStories);
        stats.put("publishedStories", publishedStories);
        stats.put("totalInitiatives", totalInitiatives);
        stats.put("publishedInitiatives", publishedInitiatives);
        stats.put("totalEnquiries", totalEnquiries);
        
        return stats;
    }
}
