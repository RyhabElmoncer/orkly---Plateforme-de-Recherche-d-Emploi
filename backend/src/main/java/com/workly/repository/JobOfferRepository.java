package com.workly.repository;

import com.workly.entity.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {
    List<JobOffer> findByActiveTrue();
    List<JobOffer> findByCategoryAndActiveTrue(String category);
}
