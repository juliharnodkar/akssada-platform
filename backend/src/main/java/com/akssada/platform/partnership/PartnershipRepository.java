package com.akssada.platform.partnership;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PartnershipRepository extends JpaRepository<PartnershipInquiry, UUID> {
}
