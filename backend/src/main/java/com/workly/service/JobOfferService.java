package com.workly.service;

import com.workly.dto.JobOfferDto;
import com.workly.entity.JobOffer;
import com.workly.entity.User;
import com.workly.repository.JobOfferRepository;
import com.workly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobOfferService {

    @Autowired
    private JobOfferRepository jobOfferRepository;

    @Autowired
    private UserRepository userRepository;

    public List<JobOfferDto> getAllOffers() {
        return jobOfferRepository.findByActiveTrue()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<JobOfferDto> getRecommendedOffers(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<JobOffer> allOffers = jobOfferRepository.findByActiveTrue();

        // Simple matching: sort offers by skill overlap with user profile
        return allOffers.stream()
                .sorted((a, b) -> {
                    int scoreA = matchScore(user, a);
                    int scoreB = matchScore(user, b);
                    return scoreB - scoreA;
                })
                .limit(6)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private int matchScore(User user, JobOffer offer) {
        if (user.getSkills() == null || offer.getRequiredSkills() == null) return 0;
        long matches = offer.getRequiredSkills().stream()
                .filter(s -> user.getSkills().stream()
                        .anyMatch(us -> us.toLowerCase().contains(s.toLowerCase())))
                .count();
        return (int) matches;
    }

    private JobOfferDto mapToDto(JobOffer offer) {
        return JobOfferDto.builder()
                .id(offer.getId())
                .title(offer.getTitle())
                .company(offer.getCompany())
                .companyInitials(offer.getCompanyInitials())
                .companyColor(offer.getCompanyColor())
                .location(offer.getLocation())
                .contractType(offer.getContractType())
                .description(offer.getDescription())
                .requiredSkills(offer.getRequiredSkills())
                .category(offer.getCategory())
                .postedAt(offer.getPostedAt())
                .build();
    }
}
