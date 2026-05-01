package com.workly.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvAnalysisDto {
    private Integer score;
    private String level;
    private String message;
    private List<String> improvements;
    private List<String> strengths;
}
