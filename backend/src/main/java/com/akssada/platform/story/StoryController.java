package com.akssada.platform.story;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/stories")
public class StoryController {

    private final StoryService storyService;

    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    @GetMapping
    public List<StorySummaryDto> list() {
        return storyService.listPublished();
    }

    @GetMapping("/{slug}")
    public StoryDetailDto getBySlug(@PathVariable String slug) {
        return storyService.getPublishedBySlug(slug);
    }
}
