package com.senior.project.backend.portfolio;

import com.senior.project.backend.Constants;
import com.senior.project.backend.artifact.ArtifactHandler;
import com.senior.project.backend.artifact.ArtifactService;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.submissions.SubmissionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.RouterFunctions;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ArtifactHandlerTest {

    private WebTestClient webTestClient;

    @InjectMocks
    private ArtifactHandler artifactHandler;

    @Mock
    private ArtifactService artifactService;

    @Mock
    private SubmissionService submissionService;

    @Mock
    private CurrentUserUtil currentUserUtil;

    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(RouterFunctions.route()
                        .POST("/test", artifactHandler::handleSubmissionUpload)
                        .POST("/profileImage", artifactHandler::handleProfileImageUpload)
                        .GET("/test/{artifactID}", artifactHandler::serveFile)
                        .GET("/userProfileImage", artifactHandler::serveUserProfileImage)
                        .DELETE("/test/{id}", artifactHandler::handleFileDelete)
                        .build())
                .build();
    }

    @Test
    public void testHandleSubmissionUpload() {
        // Stub the service method to return an integer (e.g. 123)
        when(artifactService.processSubmissionFile(any()))
                .thenReturn(Mono.just(123));

        // Build a multipart request with a "file" part.
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("file", "dummy content".getBytes())
                .filename("test.pdf")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE);

        webTestClient.post().uri("/test")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(builder.build()))
                .exchange()
                .expectStatus().isOk()
                .expectBody(Integer.class).isEqualTo(123);
    }

    @Test
    public void testHandleEventImageUploadInvalidEventID() {
        // When eventID is not a valid integer, we expect BAD_REQUEST.
        webTestClient.post().uri("/eventImage/invalid")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData("file", "dummy".getBytes()))
                .exchange()
                .expectStatus().isBadRequest();
    }


    @Test
    public void testHandleProfileImageUpload() {
        // Stub the service method to return an integer (e.g. 789)
        when(artifactService.processProfileImage(any()))
                .thenReturn(Mono.just(789));

        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("file", "dummy image".getBytes())
                .filename("profile.png")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_PNG_VALUE);

        webTestClient.post().uri("/profileImage")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(builder.build()))
                .exchange()
                .expectStatus().isOk()
                .expectBody(Integer.class).isEqualTo(789);
    }

    @Test
    public void testServeUserProfileImageWithPicture() {
        // Create a dummy image resource
        byte[] imageContent = "dummy image content".getBytes();
        ByteArrayResource resource = new ByteArrayResource(imageContent);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        ResponseEntity<Resource> responseEntity = new ResponseEntity<>(resource, headers, HttpStatus.OK);

        // Create a user with a profile picture (using UUID)
        User user = mock(User.class);
        UUID userId = UUID.fromString("00000000-0000-0000-0000-000000000010");
        lenient().when(user.getId()).thenReturn(userId);
        lenient().when(user.getProfilePictureId()).thenReturn(20); // some non-null id
        lenient().when(user.hasAdminPrivileges()).thenReturn(false);
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(user));

        // Stub artifactService.getFile to return our ResponseEntity
        when(artifactService.getFile(anyString(), any())).thenReturn(Mono.just(responseEntity));

        webTestClient.get().uri("/userProfileImage")
                .exchange()
                .expectStatus().isOk()
                .expectBody(byte[].class).isEqualTo(imageContent);
    }


    @Test
    public void testServeUserProfileImageNoPicture() {
        // Create a user with no profile picture
        User user = mock(User.class);
        UUID userId = UUID.fromString("00000000-0000-0000-0000-000000000011");
        lenient().when(user.getId()).thenReturn(userId);
        lenient().when(user.getProfilePictureId()).thenReturn(null);
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(user));

        webTestClient.get().uri("/userProfileImage")
                .exchange()
                .expectStatus().isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    public void testHandleFileUpload() throws IOException {

//        IDK how to test this

//        when(artifactService.processFile(any())).thenReturn(Mono.just("test"));

//        ByteArrayResource resource = new ByteArrayResource("contentBytes".getBytes());
//
//        MimeType mimeType = MimeTypeUtils.TEXT_PLAIN;
//        FilePart filePart = new FilePart("file", "filename", resource, mimeType);
//        return new FormDataPart("file", filePart);
        // Create FilePart
//        FilePart filePart = new FilePart("file", resource, resource.getClass(), null);
//        FilePart filePart = new MockMultipartFile("file", "filename", "text/plain", "contentBytes".getBytes());
//        FilePart filePart = mock(FilePart.class);
//        when(filePart.transferTo((File) any())).thenReturn(Mono.empty());
//        when(filePart.transferTo((Path) any())).thenReturn(Mono.empty());

//        MockServerRequest request = MockServerRequest.builder()
//                .header(HttpHeaders.CONTENT_TYPE, MediaType.MULTIPART_FORM_DATA_VALUE)
//                .body(BodyInserters.fromMultipartData("file", filePart));
//
//        Mono<ServerResponse> responseMono = artifactHandler.handleFileUpload(request);
//        assertNotNull(responseMono);
//        StepVerifier.create(responseMono).expectNext("test").expectComplete().verify();

//        MockMultipartFile mockMultipartFile = new MockMultipartFile(
//                "multipartFile",
//                "test.pdf",
//                "application/pdf",
//                new ClassPathResource("test.pdf").getInputStream());

//        FilePart filePart = mock(FilePart.class);
//        when(filePart.filename()).thenReturn("TestImage.png");
//
//        File file = new File(filePart.filename());
//        var multi = new MockMultipartFile("name", "content".getBytes());
//
//        String result = webTestClient.post()
//                .uri("/test")
//                .header(HttpHeaders.CONTENT_TYPE, MediaType.MULTIPART_FORM_DATA_VALUE)
//                .body(BodyInserters.fromMultipartData("file", multi))
//                .exchange().expectStatus().isOk()
//                .expectBody(String.class).returnResult().getResponseBody();
//        assertNotNull(result);
//        assertEquals("test", result);
    }

    @Test
    public void testServeFile() {
        // Mock response entity
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        byte[] pdfContent = "Your PDF Content".getBytes();
        ByteArrayResource resource = new ByteArrayResource(pdfContent);
        ResponseEntity<Resource> responseEntity = new ResponseEntity<>(resource, headers, HttpStatus.OK);

        // Mock artifactService
        when(artifactService.getFile(anyString(), any())).thenReturn(Mono.just(responseEntity));

        // Perform the request
        webTestClient.get().uri("/test/1")
                .exchange()
                .expectStatus().isOk()
                .expectBody(byte[].class)
                .isEqualTo(pdfContent);
    }

//    Can't seem to mock the Security util here so Not sure how to test
//
//    @Test
//    public void testServeUserProfileIMage() {
//        // Mock response entity
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.IMAGE_PNG);
//        byte[] imageContent = "Your PDF Content".getBytes();
//        ByteArrayResource resource = new ByteArrayResource(imageContent);
//        ResponseEntity<Resource> responseEntity = new ResponseEntity<>(resource, headers, HttpStatus.OK);
//
//        // Mock artifactService
//        when(artifactService.getFile(anyString(), any())).thenReturn(Mono.just(responseEntity));
//
//        // Mock securityUtil
//        var securityUtil = mockStatic(SecurityUtil.class);
//        securityUtil.when(SecurityUtil::getCurrentUser).thenReturn(Mono.just(Constants.user1));
//
//        // Perform the request
//        webTestClient.get().uri("/userProfileImage")
//                .exchange()
//                .expectStatus().isOk()
//                .expectBody(byte[].class)
//                .isEqualTo(imageContent);
//
//        securityUtil.close();
//    }

    @Test
    public void handleFileDelete() {
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userAdmin));
        when(submissionService.findByArtifact(anyInt())).thenReturn(Mono.just(Constants.submission2));
        when(submissionService.scrubArtifact(any())).thenReturn(Mono.just(Constants.submission2));
        when(artifactService.deleteFile(anyInt())).thenReturn(Mono.just("test"));

        String result = webTestClient.delete().uri("/test/2")
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult()
                .getResponseBody();

        assertEquals(result, "test");
    }

    @Test
    public void handleFileDeleteNoSubmission() {
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userAdmin));
        when(submissionService.findByArtifact(anyInt())).thenReturn(Mono.empty());
        when(artifactService.deleteFile(anyInt())).thenReturn(Mono.just("test"));

        String result = webTestClient.delete().uri("/test/2")
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult()
                .getResponseBody();

        assertEquals(result, "test");
    }

    @Test
    public void handleFileDeleteNoSubmissionNoFile() {
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userAdmin));
        webTestClient.delete().uri("/test/1")
                .exchange()
                .expectStatus()
                .isAccepted();
    }

    @Test
    public void handleFileDeleteForbidden() {
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userFaculty));
        when(submissionService.scrubArtifact(any())).thenReturn(Mono.just(Constants.submission2));
        when(submissionService.findByArtifact(anyInt())).thenReturn(Mono.just(Constants.submission1));

        webTestClient.delete().uri("/test/2")
                .exchange()
                .expectStatus().isForbidden();
    }
}
