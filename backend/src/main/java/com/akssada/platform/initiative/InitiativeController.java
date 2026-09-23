package com.akssada.platform.initiative;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/initiatives")
public class InitiativeController {

    private final InitiativeService initiativeService;

    public InitiativeController(InitiativeService initiativeService) {
        this.initiativeService = initiativeService;
    }

    @GetMapping
    public List<InitiativeSummaryDto> list() {
        return initiativeService.listPublished();
    }

    @GetMapping("/{slug}")
    public InitiativeDetailDto getBySlug(@PathVariable String slug) {
        return initiativeService.getPublishedBySlug(slug);
    }
}
