package com.akssada.platform.volunteer;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/volunteer")
public class VolunteerController {

    private final VolunteerRepository volunteerRepository;

    public VolunteerController(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> submitVolunteer(@Valid @RequestBody VolunteerRequest request) {
        VolunteerApplication application = new VolunteerApplication(
                request.name(),
                request.email(),
                request.phone(),
                request.location(),
                request.skills(),
                request.areasOfInterest(),
                request.availability(),
                request.message()
        );
        volunteerRepository.save(application);
        return ResponseEntity.ok(Map.of("message", "Volunteer application received"));
    }
}
