package com.akssada.platform.initiative;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.akssada.platform.common.ResourceNotFoundException;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class InitiativeServiceTest {

    @Mock
    private InitiativeRepository initiativeRepository;

    private InitiativeService initiativeService;

    private Initiative published(String slug) {
        Initiative initiative = new Initiative();
        ReflectionTestUtils.setField(initiative, "title", "Title for " + slug);
        ReflectionTestUtils.setField(initiative, "slug", slug);
        ReflectionTestUtils.setField(initiative, "focusArea", "Sustainable Livelihoods");
        ReflectionTestUtils.setField(initiative, "summary", "A short summary.");
        ReflectionTestUtils.setField(initiative, "content", "Full content body.");
        ReflectionTestUtils.setField(initiative, "published", true);
        return initiative;
    }

    @Test
    void listPublished_returnsSummariesInRepositoryOrder() {
        initiativeService = new InitiativeService(initiativeRepository);
        Initiative one = published("initiative-one");
        Initiative two = published("initiative-two");
        when(initiativeRepository.findAllByPublishedTrueOrderByCreatedAtDesc())
                .thenReturn(List.of(one, two));

        List<InitiativeSummaryDto> result = initiativeService.listPublished();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).slug()).isEqualTo("initiative-one");
        assertThat(result.get(1).slug()).isEqualTo("initiative-two");
    }

    @Test
    void getPublishedBySlug_returnsDetail_whenFound() {
        initiativeService = new InitiativeService(initiativeRepository);
        Initiative initiative = published("beekeeping-sustainable-livelihoods");
        when(initiativeRepository.findBySlugAndPublishedTrue("beekeeping-sustainable-livelihoods"))
                .thenReturn(Optional.of(initiative));

        InitiativeDetailDto result = initiativeService.getPublishedBySlug("beekeeping-sustainable-livelihoods");

        assertThat(result.slug()).isEqualTo("beekeeping-sustainable-livelihoods");
        assertThat(result.content()).isEqualTo("Full content body.");
    }

    @Test
    void getPublishedBySlug_throwsNotFound_whenMissing() {
        initiativeService = new InitiativeService(initiativeRepository);
        when(initiativeRepository.findBySlugAndPublishedTrue("unknown-slug"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> initiativeService.getPublishedBySlug("unknown-slug"))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(initiativeRepository).findBySlugAndPublishedTrue("unknown-slug");
    }
}
