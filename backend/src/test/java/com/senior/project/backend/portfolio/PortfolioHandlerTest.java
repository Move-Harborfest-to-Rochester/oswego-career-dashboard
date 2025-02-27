package com.senior.project.backend.portfolio;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.senior.project.backend.domain.Interest;
import com.senior.project.backend.domain.Skill;
import com.senior.project.backend.domain.StudentDetails;
import java.util.ArrayList;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

import com.senior.project.backend.domain.YearLevel;
import com.senior.project.backend.portfolio.dto.EditEducationDTO;
import com.senior.project.backend.portfolio.dto.EducationDTO;
import com.senior.project.backend.portfolio.dto.PersonalInfoDTO;
import com.senior.project.backend.util.Endpoints;

import org.springframework.web.reactive.function.server.RouterFunctions;
import reactor.core.publisher.Mono;

@ExtendWith(MockitoExtension.class)
public class PortfolioHandlerTest {
    private WebTestClient webTestClient;

    @InjectMocks
    private PortfolioHandler portfolioHandler;

    @Mock
    private PortfolioService portfolioService;


    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(
            RouterFunctions.route()
                .PATCH("/personalInfo", portfolioHandler::savePersonalInfo)
                .PUT("/education", portfolioHandler::saveEducation)
                .POST("/skills", portfolioHandler::saveSkills)
                .POST("/interest", portfolioHandler::saveInterest)
                .build()
        ).build();
    }




    @Test
    public void testSavePersonalInfo() {
        // Create a sample PersonalInfoDTO and stub the service.
        PersonalInfoDTO dto = new PersonalInfoDTO();
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setPreferredName("Johnny");
        dto.setEmail("john.doe@example.com");
        dto.setPhoneNumber("123-456-7890");
        dto.setLinkedIn("https://linkedin.com/in/johndoe");
        dto.setDescription("Software Developer");
        when(portfolioService.savePersonalInfo(any(PersonalInfoDTO.class)))
            .thenReturn(Mono.just(dto));

        webTestClient.patch()
            .uri("/personalInfo")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(dto)
            .exchange()
            .expectStatus().isOk()
            .expectBody(PersonalInfoDTO.class)
            .isEqualTo(dto);
    }

    @Test
    public void testSaveEducationSuccess() {
        // Create a sample EditEducationDTO request.
        EditEducationDTO educationDTO = EditEducationDTO.builder()
            .universityId(1)
            .year(YearLevel.Freshman)  // or use your enum's toString() if needed
            .gpa(3.5)
            .build();
        // Create a sample EducationDTO response.
        EducationDTO eduResponse = EducationDTO.builder()
            .universityId(1)
            .year(YearLevel.Freshman)
            .gpa(3.5)
            .majors(new ArrayList<>())
            .minors(new ArrayList<>())
            .build();
        when(portfolioService.saveEducation(any(EditEducationDTO.class)))
            .thenReturn(Mono.just(eduResponse));

        webTestClient.put()
            .uri("/education")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(educationDTO)
            .exchange()
            .expectStatus().isOk()
            .expectBody(EducationDTO.class)
            .isEqualTo(eduResponse);
    }

    @Test
    public void testSaveSkillsSuccess() {
        // Create a list of skills.
        ArrayList<Skill> skills = new ArrayList<>();
        Skill skill1 = new Skill();
        skill1.setName("Java");
        Skill skill2 = new Skill();
        skill2.setName("Spring Boot");
        skills.add(skill1);
        skills.add(skill2);

        // Create a dummy StudentDetails that includes these skills.
        StudentDetails studentDetails = new StudentDetails();
        studentDetails.setId(UUID.randomUUID());
        studentDetails.setSkills(new ArrayList<>(skills));

        when(portfolioService.saveSkills(any(ArrayList.class)))
            .thenReturn(Mono.just(studentDetails));

        webTestClient.post()
            .uri("/skills")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(skills)
            .exchange()
            .expectStatus().isOk()
            .expectBody(StudentDetails.class)
            .isEqualTo(studentDetails);
    }

    @Test
    public void testSaveInterestSuccess() {
        // Create a list of interests.
        ArrayList<Interest> interests = new ArrayList<>();
        Interest interest1 = new Interest();
        interest1.setName("Music");
        Interest interest2 = new Interest();
        interest2.setName("Sports");
        interests.add(interest1);
        interests.add(interest2);

        // Create a dummy StudentDetails that includes these interests.
        StudentDetails studentDetails = new StudentDetails();
        studentDetails.setId(UUID.randomUUID());
        studentDetails.setInterests(new ArrayList<>(interests));

        when(portfolioService.saveInterests(any(ArrayList.class)))
            .thenReturn(Mono.just(studentDetails));

        webTestClient.post()
            .uri("/interest")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(interests)
            .exchange()
            .expectStatus().isOk()
            .expectBody(StudentDetails.class)
            .isEqualTo(studentDetails);
    }
}
