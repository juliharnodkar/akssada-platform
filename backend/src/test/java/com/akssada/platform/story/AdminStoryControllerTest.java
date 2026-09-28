package com.akssada.platform.story;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.akssada.platform.initiative.Initiative;
import com.akssada.platform.initiative.InitiativeRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class AdminStoryControllerTest {

    @Mock
    private StoryRepository storyRepository;

    @Mock
    private InitiativeRepository initiativeRepository;

    private AdminStoryController adminStoryController;

    @BeforeEach
    void setUp() {
        adminStoryController = new AdminStoryController(storyRepository, initiativeRepository);
    }

    @Test
    void create_setsPublishedAt_whenPublishedIsTrue() {
        StoryRequest request = new StoryRequest("Title", "slug", "Content", "Author", "Cat", "url", null, null, true);
        
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> {
            Story story = invocation.getArgument(0);
            org.springframework.test.util.ReflectionTestUtils.setField(story, "id", UUID.randomUUID());
            return story;
        });

        ResponseEntity<StoryDetailDto> response = adminStoryController.create(request);

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().published()).isTrue();
        assertThat(response.getBody().publishedAt()).isNotNull();
    }

    @Test
    void create_doesNotSetPublishedAt_whenPublishedIsFalse() {
        StoryRequest request = new StoryRequest("Title", "slug", "Content", "Author", "Cat", "url", null, null, false);
        
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> {
            Story story = invocation.getArgument(0);
            org.springframework.test.util.ReflectionTestUtils.setField(story, "id", UUID.randomUUID());
            return story;
        });

        ResponseEntity<StoryDetailDto> response = adminStoryController.create(request);

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().published()).isFalse();
        assertThat(response.getBody().publishedAt()).isNull();
    }

    @Test
    void update_unpublishBecomesHidden_bySettingPublishedFalse() throws Exception {
        UUID storyId = UUID.randomUUID();
        Story existingStory = new Story();
        existingStory.setTitle("Old Title");
        existingStory.setSlug("old-slug");
        existingStory.setContent("Old Content");
        existingStory.setPublished(true);
        existingStory.setPublishedAt(java.time.OffsetDateTime.now());
        
        when(storyRepository.findById(storyId)).thenReturn(Optional.of(existingStory));
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> invocation.getArgument(0));

        StoryRequest request = new StoryRequest("Title", "slug", "Content", "Author", "Cat", "url", null, null, false);
        
        StoryDetailDto response = adminStoryController.update(storyId, request);

        assertThat(response.published()).isFalse();
        // Published at is preserved even if unpublished, or not cleared
        assertThat(response.publishedAt()).isNotNull();
    }

    @Test
    void update_publishBecomesVisible_bySettingPublishedTrue() throws Exception {
        UUID storyId = UUID.randomUUID();
        Story existingStory = new Story();
        existingStory.setTitle("Old Title");
        existingStory.setSlug("old-slug");
        existingStory.setContent("Old Content");
        existingStory.setPublished(false);
        existingStory.setPublishedAt(null);
        
        when(storyRepository.findById(storyId)).thenReturn(Optional.of(existingStory));
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> invocation.getArgument(0));

        StoryRequest request = new StoryRequest("Title", "slug", "Content", "Author", "Cat", "url", null, null, true);
        
        StoryDetailDto response = adminStoryController.update(storyId, request);

        assertThat(response.published()).isTrue();
        assertThat(response.publishedAt()).isNotNull();
    }
}
