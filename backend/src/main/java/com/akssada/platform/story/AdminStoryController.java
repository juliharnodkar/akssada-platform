package com.akssada.platform.story;

import com.akssada.platform.common.ResourceNotFoundException;
import com.akssada.platform.initiative.Initiative;
import com.akssada.platform.initiative.InitiativeRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/blog")
public class AdminStoryController {

    private final StoryRepository storyRepository;
    private final InitiativeRepository initiativeRepository;

    public AdminStoryController(StoryRepository storyRepository, InitiativeRepository initiativeRepository) {
        this.storyRepository = storyRepository;
        this.initiativeRepository = initiativeRepository;
    }

    @GetMapping
    public List<StoryDetailDto> listAll() {
        return storyRepository.findAll().stream()
                .map(StoryDetailDto::from)
                .toList();
    }

    @GetMapping("/{id}")
    public StoryDetailDto getById(@PathVariable UUID id) {
        return storyRepository.findById(id)
                .map(StoryDetailDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found: " + id));
    }

    @PostMapping
    public ResponseEntity<StoryDetailDto> create(@Valid @RequestBody StoryRequest req) {
        Story story = new Story();
        applyRequest(story, req);
        Story saved = storyRepository.save(story);
        return ResponseEntity.status(HttpStatus.CREATED).body(StoryDetailDto.from(saved));
    }

    @PutMapping("/{id}")
    public StoryDetailDto update(@PathVariable UUID id, @Valid @RequestBody StoryRequest req) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found: " + id));
        applyRequest(story, req);
        return StoryDetailDto.from(storyRepository.save(story));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!storyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Article not found: " + id);
        }
        storyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void applyRequest(Story story, StoryRequest req) {
        story.setTitle(req.title());
        story.setSlug(req.slug());
        story.setContent(req.content());
        story.setAuthorName(req.authorName());
        story.setCategory(req.category());
        story.setCoverImageUrl(req.coverImageUrl());
        story.setAdditionalImageUrls(req.additionalImageUrls());
        story.setPublished(req.published());
        if (req.published() && story.getPublishedAt() == null) {
            story.setPublishedAt(OffsetDateTime.now());
        }
        if (req.initiativeId() != null) {
            Initiative initiative = initiativeRepository.findById(req.initiativeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Initiative not found: " + req.initiativeId()));
            story.setInitiative(initiative);
        } else {
            story.setInitiative(null);
        }
    }
}
