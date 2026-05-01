package com.workly.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate birthDate;
    private String city;
    private String educationLevel;
    private String speciality;
    private Integer graduationYear;
    private List<String> skills;
    private Integer cvScore;
    private String cvFilePath;
}
