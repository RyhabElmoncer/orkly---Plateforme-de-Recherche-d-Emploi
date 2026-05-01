package com.workly.config;

import com.workly.entity.JobOffer;
import com.workly.repository.JobOfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private JobOfferRepository jobOfferRepository;

    @Override
    public void run(String... args) {
        if (jobOfferRepository.count() == 0) {
            List<JobOffer> offers = List.of(
                JobOffer.builder().title("Développeur Full Stack Junior").company("TechSoft")
                    .companyInitials("TS").companyColor("#2563EB").location("Tunis")
                    .contractType("CDI").description("Rejoignez notre équipe pour développer des applications web modernes.")
                    .requiredSkills(List.of("C++", "HTML", "JavaScript", "React")).category("Développement").build(),
                JobOffer.builder().title("Assistant Marketing Digital").company("InovaCom")
                    .companyInitials("IN").companyColor("#7C3AED").location("Tunis")
                    .contractType("Stage").description("Gérez nos campagnes digitales et notre présence en ligne.")
                    .requiredSkills(List.of("Google Ads", "CRM", "Marketing Digital")).category("Marketing").build(),
                JobOffer.builder().title("Data Analyst Junior").company("DataGrowth")
                    .companyInitials("DG").companyColor("#F97316").location("Tunis")
                    .contractType("CDD").description("Analysez les données pour prendre des décisions éclairées.")
                    .requiredSkills(List.of("SQL", "Excel", "Python", "Analyse de données")).category("Data").build(),
                JobOffer.builder().title("UI/UX Designer Junior").company("WebCen")
                    .companyInitials("WD").companyColor("#10B981").location("Tunis")
                    .contractType("CDI").description("Créez des expériences utilisateur exceptionnelles.")
                    .requiredSkills(List.of("Figma", "UI/UX Design", "Adobe XD")).category("Design").build(),
                JobOffer.builder().title("Développeur React").company("StartupTN")
                    .companyInitials("ST").companyColor("#EF4444").location("Sfax")
                    .contractType("CDI").description("Développez des interfaces modernes avec React.")
                    .requiredSkills(List.of("React", "JavaScript", "Node.js", "TypeScript")).category("Développement").build(),
                JobOffer.builder().title("Chef de Projet Junior").company("ConsultPro")
                    .companyInitials("CP").companyColor("#8B5CF6").location("Tunis")
                    .contractType("CDI").description("Gérez des projets IT de A à Z.")
                    .requiredSkills(List.of("Gestion de projet", "Communication", "Agile")).category("Management").build()
            );
            jobOfferRepository.saveAll(offers);
        }
    }
}
