package com.workly.controller;

import com.workly.dto.CvAnalysisDto;
import com.workly.dto.UserDto;
import com.workly.service.CvAnalysisService;
import com.workly.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private CvAnalysisService cvAnalysisService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserByEmail(userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id,
                                               @RequestBody UserDto dto,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    @GetMapping("/{id}/cv-analysis")
    public ResponseEntity<CvAnalysisDto> analyzeCv(@PathVariable Long id) {
        return ResponseEntity.ok(cvAnalysisService.analyzeProfile(id));
    }

    @PostMapping("/{id}/upload-cv")
    public ResponseEntity<CvAnalysisDto> uploadCv(@PathVariable Long id,
                                                    @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(cvAnalysisService.analyzeUploadedCv(id, file));
    }
}
