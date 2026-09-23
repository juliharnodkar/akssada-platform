package com.akssada.platform.initiative;

import com.akssada.platform.common.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class InitiativeService {

    private final InitiativeRepository initiativeRepository;

    public InitiativeService(InitiativeRepository initiativeRepository) {
        this.initiativeRepository = initiativeRepository;
    }

    public List<InitiativeSummaryDto> listPublished() {
        return initiativeRepository.findAllByPublishedTrueOrderByCreatedAtDesc().stream()
                .map(InitiativeSummaryDto::from)
                .toList();
    }

    public InitiativeDetailDto getPublishedBySlug(String slug) {
        return initiativeRepository.findBySlugAndPublishedTrue(slug)
                .map(InitiativeDetailDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("Initiative not found: " + slug));
    }
}
