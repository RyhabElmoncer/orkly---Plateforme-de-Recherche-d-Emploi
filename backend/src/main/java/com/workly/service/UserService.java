package com.workly.service;

import com.workly.dto.UserDto;
import com.workly.entity.User;
import com.workly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CvAnalysisService cvAnalysisService;

    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDto(user);
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDto(user);
    }

    public UserDto updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setCity(dto.getCity());
        user.setBirthDate(dto.getBirthDate());
        user.setEducationLevel(dto.getEducationLevel());
        user.setSpeciality(dto.getSpeciality());
        user.setGraduationYear(dto.getGraduationYear());
        user.setSkills(dto.getSkills());

        // Recalculate score
        int newScore = cvAnalysisService.calculateProfileScore(
                dto.getSkills(), dto.getEducationLevel(), dto.getSpeciality()
        );
        user.setCvScore(newScore);

        userRepository.save(user);
        return mapToDto(user);
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .birthDate(user.getBirthDate())
                .city(user.getCity())
                .educationLevel(user.getEducationLevel())
                .speciality(user.getSpeciality())
                .graduationYear(user.getGraduationYear())
                .skills(user.getSkills())
                .cvScore(user.getCvScore())
                .cvFilePath(user.getCvFilePath())
                .build();
    }
}
