package com.akssada.platform.story;

import com.akssada.platform.common.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class StoryService {

    private final StoryRepository storyRepository;

    public StoryService(StoryRepository storyRepository) {
        this.storyRepository = storyRepository;
    }

    public List<StorySummaryDto> listPublished() {
        return storyRepository.findAllByPublishedTrueOrderByPublishedAtDesc().stream()
                .map(StorySummaryDto::from)
                .toList();
    }

    public StoryDetailDto getPublishedBySlug(String slug) {
        return storyRepository.findBySlugAndPublishedTrue(slug)
                .map(StoryDetailDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found: " + slug));
    }
}
