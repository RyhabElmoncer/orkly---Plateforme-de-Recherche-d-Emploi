package com.workly.service;

import com.workly.dto.CvAnalysisDto;
import com.workly.entity.User;
import com.workly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class CvAnalysisService {

    @Autowired
    private UserRepository userRepository;

    private static final List<String> TECH_SKILLS = List.of(
            "javascript", "python", "java", "react", "angular", "node.js", "sql",
            "spring", "docker", "kubernetes", "git", "html", "css", "typescript",
            "c++", "data science", "machine learning", "ui/ux design"
    );

    private static final List<String> SOFT_SKILLS = List.of(
            "communication", "gestion de projet", "marketing digital", "analyse de données"
    );

    public int calculateProfileScore(List<String> skills, String educationLevel, String speciality) {
        int score = 0;

        // Base score from education level
        if (educationLevel != null) {
            score += switch (educationLevel.toLowerCase()) {
                case "bac+5", "master", "ingénieur" -> 30;
                case "bac+3", "licence" -> 22;
                case "bac+2", "bts", "dut" -> 15;
                default -> 10;
            };
        }

        // Score from skills
        if (skills != null && !skills.isEmpty()) {
            int techCount = 0;
            int softCount = 0;
            for (String skill : skills) {
                String lower = skill.toLowerCase();
                if (TECH_SKILLS.stream().anyMatch(lower::contains)) techCount++;
                if (SOFT_SKILLS.stream().anyMatch(lower::contains)) softCount++;
            }
            score += Math.min(techCount * 6, 40);
            score += Math.min(softCount * 5, 15);
        }

        // Speciality bonus
        if (speciality != null && !speciality.isEmpty()) {
            score += 10;
        }

        return Math.min(score, 100);
    }

    public CvAnalysisDto analyzeProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int score = user.getCvScore() != null ? user.getCvScore() : 0;

        List<String> improvements = new ArrayList<>();
        List<String> strengths = new ArrayList<>();

        // Analyze strengths
        if (user.getSkills() != null && user.getSkills().size() >= 3) {
            strengths.add("Profil multi-compétences bien développé");
        }
        if (user.getEducationLevel() != null && !user.getEducationLevel().isEmpty()) {
            strengths.add("Niveau d'études renseigné : " + user.getEducationLevel());
        }
        if (user.getSpeciality() != null && !user.getSpeciality().isEmpty()) {
            strengths.add("Spécialité définie : " + user.getSpeciality());
        }

        // Suggest improvements
        if (score < 80) improvements.add("Formation supplémentaire recommandée");
        if (user.getSkills() == null || user.getSkills().size() < 5) {
            improvements.add("Ajouter plus de compétences techniques");
        }
        improvements.add("Renforcer la maîtrise de l'anglais (A2 → B2)");
        improvements.add("Développer les Soft Skills (communication, travail en équipe)");
        improvements.add("Ajouter des projets personnels dans votre CV");
        if (user.getCvFilePath() == null) {
            improvements.add("Télécharger votre CV pour une analyse complète");
        }

        String level = score >= 80 ? "Excellent" : score >= 60 ? "Au-dessus de la moyenne" : "En développement";
        String message = "Ton potentiel professionnel est " + level.toLowerCase() + " !";

        return CvAnalysisDto.builder()
                .score(score)
                .level(level)
                .message(message)
                .improvements(improvements)
                .strengths(strengths)
                .build();
    }

    public CvAnalysisDto analyzeUploadedCv(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Simulate CV content analysis
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        int baseScore = user.getCvScore() != null ? user.getCvScore() : 50;

        // Boost score for uploaded CV
        int newScore = Math.min(baseScore + 10, 100);
        user.setCvScore(newScore);
        user.setCvFilePath("/uploads/" + filename);
        userRepository.save(user);

        return analyzeProfile(userId);
    }
}
