package com.workly.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

public class AuthDto {

    @Data
    public static class RegisterRequest {
        @NotBlank
        private String firstName;
        @NotBlank
        private String lastName;
        @Email
        @NotBlank
        private String email;
        @NotBlank
        private String password;
        private LocalDate birthDate;
        private String city;
        private String educationLevel;
        private String speciality;
        private Integer graduationYear;
        private List<String> skills;
    }

    @Data
    public static class LoginRequest {
        @Email
        @NotBlank
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    @lombok.Builder
    public static class AuthResponse {
        private String token;
        private String email;
        private String firstName;
        private String lastName;
        private Long userId;
        private Integer cvScore;
    }
}
