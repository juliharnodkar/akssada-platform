package com.akssada.platform.initiative;

import com.akssada.platform.common.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/initiatives")
public class AdminInitiativeController {

    private final InitiativeRepository initiativeRepository;

    public AdminInitiativeController(InitiativeRepository initiativeRepository) {
        this.initiativeRepository = initiativeRepository;
    }

    @GetMapping
    public List<InitiativeDetailDto> listAll() {
        return initiativeRepository.findAll().stream()
                .map(InitiativeDetailDto::from)
                .toList();
    }

    @GetMapping("/{id}")
    public InitiativeDetailDto getById(@PathVariable UUID id) {
        return initiativeRepository.findById(id)
                .map(InitiativeDetailDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("Initiative not found: " + id));
    }

    @PostMapping
    public ResponseEntity<InitiativeDetailDto> create(@Valid @RequestBody InitiativeRequest req) {
        Initiative initiative = new Initiative();
        applyRequest(initiative, req);
        Initiative saved = initiativeRepository.save(initiative);
        return ResponseEntity.status(HttpStatus.CREATED).body(InitiativeDetailDto.from(saved));
    }

    @PutMapping("/{id}")
    public InitiativeDetailDto update(@PathVariable UUID id, @Valid @RequestBody InitiativeRequest req) {
        Initiative initiative = initiativeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Initiative not found: " + id));
        applyRequest(initiative, req);
        return InitiativeDetailDto.from(initiativeRepository.save(initiative));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!initiativeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Initiative not found: " + id);
        }
        initiativeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void applyRequest(Initiative initiative, InitiativeRequest req) {
        initiative.setTitle(req.title());
        initiative.setSlug(req.slug());
        initiative.setFocusArea(req.focusArea());
        initiative.setSummary(req.summary());
        initiative.setContent(req.content());
        initiative.setCoverImageUrl(req.coverImageUrl());
        initiative.setPublished(req.published());
    }
}
