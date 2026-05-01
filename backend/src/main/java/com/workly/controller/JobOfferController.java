package com.workly.controller;

import com.workly.dto.JobOfferDto;
import com.workly.service.JobOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobOfferController {

    @Autowired
    private JobOfferService jobOfferService;

    @GetMapping
    public ResponseEntity<List<JobOfferDto>> getAllOffers() {
        return ResponseEntity.ok(jobOfferService.getAllOffers());
    }

    @GetMapping("/recommended")
    public ResponseEntity<List<JobOfferDto>> getRecommended(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(jobOfferService.getRecommendedOffers(userDetails.getUsername()));
    }
}
