package com.workly.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobOfferDto {
    private Long id;
    private String title;
    private String company;
    private String companyInitials;
    private String companyColor;
    private String location;
    private String contractType;
    private String description;
    private List<String> requiredSkills;
    private String category;
    private LocalDateTime postedAt;
}
