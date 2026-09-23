package com.akssada.platform.story;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.akssada.platform.common.ResourceNotFoundException;
import com.akssada.platform.initiative.Initiative;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class StoryServiceTest {

    @Mock
    private StoryRepository storyRepository;

    private StoryService storyService;

    private Story published(String slug, Initiative initiative) {
        Story story = new Story();
        ReflectionTestUtils.setField(story, "title", "Title for " + slug);
        ReflectionTestUtils.setField(story, "slug", slug);
        ReflectionTestUtils.setField(story, "content", "Full story content.");
        ReflectionTestUtils.setField(story, "authorName", "AKSSADA Team");
        ReflectionTestUtils.setField(story, "category", "Sustainable Livelihoods");
        ReflectionTestUtils.setField(story, "initiative", initiative);
        ReflectionTestUtils.setField(story, "published", true);
        ReflectionTestUtils.setField(story, "publishedAt", OffsetDateTime.now());
        return story;
    }

    private Initiative initiativeWithSlug(String slug) {
        Initiative initiative = org.mockito.Mockito.mock(Initiative.class);
        when(initiative.getSlug()).thenReturn(slug);
        return initiative;
    }

    @Test
    void listPublished_mapsInitiativeSlug() {
        storyService = new StoryService(storyRepository);
        Initiative initiative = initiativeWithSlug("beekeeping-sustainable-livelihoods");
        Story story = published("why-we-started-with-beekeeping", initiative);
        when(storyRepository.findAllByPublishedTrueOrderByPublishedAtDesc())
                .thenReturn(List.of(story));

        List<StorySummaryDto> result = storyService.listPublished();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).initiativeSlug()).isEqualTo("beekeeping-sustainable-livelihoods");
    }

    @Test
    void getPublishedBySlug_returnsDetail_whenFound() {
        storyService = new StoryService(storyRepository);
        Story story = published("planning-the-first-medicinal-plant-nursery", null);
        when(storyRepository.findBySlugAndPublishedTrue("planning-the-first-medicinal-plant-nursery"))
                .thenReturn(Optional.of(story));

        StoryDetailDto result = storyService.getPublishedBySlug("planning-the-first-medicinal-plant-nursery");

        assertThat(result.content()).isEqualTo("Full story content.");
        assertThat(result.initiativeSlug()).isNull();
    }

    @Test
    void getPublishedBySlug_throwsNotFound_whenMissing() {
        storyService = new StoryService(storyRepository);
        when(storyRepository.findBySlugAndPublishedTrue("unknown-slug"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> storyService.getPublishedBySlug("unknown-slug"))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}


