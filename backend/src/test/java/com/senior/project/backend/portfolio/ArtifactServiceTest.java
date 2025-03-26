package com.senior.project.backend.portfolio;

import com.senior.project.backend.Constants;
import com.senior.project.backend.artifact.ArtifactRepository;
import com.senior.project.backend.artifact.ArtifactService;
import com.senior.project.backend.domain.Artifact;
import com.senior.project.backend.domain.ArtifactType;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.event.LocalistService;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.users.UserRepository;
import com.senior.project.backend.util.NonBlockingExecutor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.core.io.buffer.DefaultDataBufferFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.Callable;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ArtifactServiceTest {

    @InjectMocks
    private ArtifactService artifactService;

    @Mock
    private ArtifactRepository artifactRepository;

    @Mock
    private LocalistService localistService;

    @Mock
    private CurrentUserUtil currentUserUtil;

    @Mock
    private UserRepository userRepository;

    @Test
    public void testProcessProfileImageSuccess() throws Exception {
        // Create a valid square (1:1) PNG image
        BufferedImage img = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(img, "png", baos);
        byte[] imageBytes = baos.toByteArray();
        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        DataBuffer imageDataBuffer = dataBufferFactory.wrap(imageBytes);

        // Mock FilePart behavior
        FilePart filePart = mock(FilePart.class);
        when(filePart.content()).thenReturn(Flux.just(imageDataBuffer));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        when(filePart.headers()).thenReturn(headers);
        when(filePart.filename()).thenReturn("test.png");

        // Setup current user without an existing profile picture
        User user = mock(User.class);
        UUID userId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        when(user.getId()).thenReturn(userId);
        when(user.getProfilePictureId()).thenReturn(null);
        lenient().when(user.hasAdminPrivileges()).thenReturn(false);
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(user));

        // Simulate artifact repository save and lookup
        Artifact savedArtifact = Artifact.builder()
                .id(123)
                // Note: The file location in the saved artifact isn’t used since the service
                // generates its own unique filename; using a dummy value here is acceptable.
                .fileLocation("dummy-location")
                .build();
        when(artifactRepository.save(any())).thenReturn(savedArtifact);
        // Mark this stubbing as lenient so that Mockito won’t complain if it isn’t used
        lenient().when(artifactRepository.findByUniqueIdentifier(anyString()))
                .thenReturn(Optional.of(savedArtifact));

        // Stub the updateProfilePictureId call to avoid NullPointerException
        doNothing().when(userRepository).updateProfilePictureId(any(UUID.class), anyInt());

        // Create a temporary directory to simulate the upload directory (ensuring it exists)
        Path tempUploadDir = Files.createTempDirectory("testUploads");
        ReflectionTestUtils.setField(artifactService, "uploadDirectory", tempUploadDir.toString());

        // Stub ImageIO.write to simulate a successful image write to file
        try (MockedStatic<ImageIO> imageIOMock = mockStatic(ImageIO.class)) {
            imageIOMock.when(() -> ImageIO.write(any(BufferedImage.class), anyString(), any(File.class)))
                    .thenReturn(true);
            Mono<Integer> result = artifactService.processProfileImage(filePart);
            StepVerifier.create(result)
                    .expectNext(123)
                    .expectComplete()
                    .verify();
        }
    }

    @Test
    public void testProcessFile() throws NoSuchFieldException, IllegalAccessException {
        FilePart filePart = mock(FilePart.class);

        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        DataBuffer dataBuffer = dataBufferFactory.wrap("file content".getBytes());
        when(filePart.content()).thenReturn(Flux.just(dataBuffer));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        when(filePart.headers()).thenReturn(headers);
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userAdmin));
        when(filePart.transferTo((Path) any())).thenReturn(Mono.empty());
        when(artifactRepository.save(any())).thenReturn(Constants.artifact1);
        when(artifactRepository.findByUniqueIdentifier(anyString())).thenReturn(Optional.of(Constants.artifact1));

        // Use reflection to set the value of uploadDirectory
        Field uploadDirectoryField = ArtifactService.class.getDeclaredField("uploadDirectory");
        uploadDirectoryField.setAccessible(true); // Make the private field accessible
        uploadDirectoryField.set(artifactService, "/mocked/upload/directory");

        Mono<Integer> result = artifactService.processSubmissionFile(filePart);
        StepVerifier.create(result).expectNext(Constants.artifact1.getId()).expectComplete().verify();
    }

    @Test
    public void testProcessFileToLarge() {
        FilePart filePart = mock(FilePart.class);

        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        long bufferSize = 10 * 1024 * 1024 + 1;
        byte[] bufferContent = new byte[(int) bufferSize];
        DataBuffer dataBuffer = dataBufferFactory.wrap(bufferContent);

        when(filePart.content()).thenReturn(Flux.just(dataBuffer));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> artifactService.processSubmissionFile(filePart).block());

        assertEquals(HttpStatus.PAYLOAD_TOO_LARGE, exception.getStatusCode());
    }

    @Test
    public void testProcessFileWrongContentType() {
        FilePart filePart = mock(FilePart.class);

        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        DataBuffer dataBuffer = dataBufferFactory.wrap("file content".getBytes());
        when(filePart.content()).thenReturn(Flux.just(dataBuffer));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        when(filePart.headers()).thenReturn(headers);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> artifactService.processSubmissionFile(filePart).block());

        assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE, exception.getStatusCode());
    }

    @Test
    public void testProcessFileNoContentType() {
        FilePart filePart = mock(FilePart.class);

        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        DataBuffer dataBuffer = dataBufferFactory.wrap("file content".getBytes());
        when(filePart.content()).thenReturn(Flux.just(dataBuffer));

        HttpHeaders headers = new HttpHeaders();
        when(filePart.headers()).thenReturn(headers);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> artifactService.processSubmissionFile(filePart).block());

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    public void testGetFileFailPathCheck() {
        when(artifactRepository.findById(any())).thenReturn(Optional.ofNullable(Constants.artifact2));
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userAdmin));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        Path artifactPath = Paths.get(Constants.artifact2.getFileLocation());

        ReflectionTestUtils.setField(artifactService, "uploadDirectory", artifactPath.getParent().toAbsolutePath().toString());

        ReflectionTestUtils.setField(artifactService, "uploadDirectory", "");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> artifactService.getFile("1", headers).block());

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    public void testGetFile() {
        when(artifactRepository.findById(any())).thenReturn(Optional.ofNullable(Constants.artifact1));
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userAdmin));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        Path artifact1path = Paths.get(Constants.artifact1.getFileLocation());

        ReflectionTestUtils.setField(artifactService, "uploadDirectory", artifact1path.getParent().toAbsolutePath().toString());

        var result = artifactService.getFile("1", headers).block();

        assert result != null;
        assertTrue(result.getStatusCode().is2xxSuccessful());
        assertEquals(headers, result.getHeaders());
        var expectedBody = new FileSystemResource(artifact1path.toAbsolutePath().normalize());
        assertEquals(expectedBody, result.getBody());
    }

    @Test
    public void testFindById() {
        when(artifactRepository.findById(any())).thenReturn(Optional.of(Constants.artifact1));

        Mono<Artifact> artifacts = artifactService.findById(0);

        StepVerifier.create(artifacts)
                .expectNext(Constants.artifact1)
                .expectComplete()
                .verify();
    }

    @Test
    public void testFindByIdEmpty() {
        when(artifactRepository.findById(any())).thenReturn(Optional.empty());

        Mono<Artifact> artifacts = artifactService.findById(0);

        StepVerifier.create(artifacts)
                .expectComplete()
                .verify();
    }

    @Test
    public void testFindByUniqueFilename() {
        when(artifactRepository.findByUniqueIdentifier(anyString())).thenReturn(Optional.of(Constants.artifact1));

        Mono<Artifact> artifacts = artifactService.findByUniqueFilename("asdf");

        StepVerifier.create(artifacts)
                .expectNext(Constants.artifact1)
                .expectComplete()
                .verify();
    }

    @Test
    public void testFindByUniqueFilenameEmpty() {
        when(artifactRepository.findByUniqueIdentifier(anyString())).thenReturn(Optional.empty());

        Mono<Artifact> artifacts = artifactService.findByUniqueFilename("asdf");

        StepVerifier.create(artifacts)
                .expectComplete()
                .verify();
    }

    @Test
    public void testDeleteFileInternalName() {
        when(artifactRepository.findByUniqueIdentifier(anyString())).thenReturn(Optional.of(Constants.artifact1));
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userAdmin));
        MockedStatic<Paths> paths = mockStatic(Paths.class);
        MockedStatic<Files> files = mockStatic(Files.class);
        paths.when(() -> Paths.get(any())).thenReturn(null);
        files.when(() -> Files.deleteIfExists(any())).thenReturn(true);
        Mono<String> result = artifactService.deleteFile("asdf");

        result = result.map((r) -> {
            paths.close();
            files.close();
            return r;
        });

        StepVerifier.create(result)
                .expectNext("File deleted successfully")
                .expectComplete()
                .verify();
    }

    @Test
    public void testDeleteFileInternalNameEmpty() {
        when(artifactRepository.findByUniqueIdentifier(any())).thenReturn(Optional.empty());
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userAdmin));
        Mono<String> result = artifactService.deleteFile("asdf");

        StepVerifier.create(result)
                .expectComplete()
                .verify();
    }

    @Test
    public void testDeleteFileId() {
        when(artifactRepository.findById(any())).thenReturn(Optional.of(Constants.artifact1));
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userAdmin));
        MockedStatic<Paths> paths = mockStatic(Paths.class);
        MockedStatic<Files> files = mockStatic(Files.class);
        paths.when(() -> Paths.get(any())).thenReturn(null);
        files.when(() -> Files.deleteIfExists(any())).thenReturn(true);
        Mono<String> result = artifactService.deleteFile(2);

        result = result.map((r) -> {
            paths.close();
            files.close();

            return r;
        });

        StepVerifier.create(result)
                .expectNext("File deleted successfully")
                .expectComplete()
                .verify();
    }

    @Test
    public void testDeleteFileIdArtfact1() {
        Mono<String> result = artifactService.deleteFile(1);

        StepVerifier.create(result)
                .expectNext("Success")
                .expectComplete()
                .verify();
    }

    @Test
    public void testDeleteFileIdEmpty() {
        when(artifactRepository.findById(any())).thenReturn(Optional.empty());
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userAdmin));
        Mono<String> result = artifactService.deleteFile(2);

        StepVerifier.create(result)
                .expectComplete()
                .verify();
    }

    @Test
    public void testDeleteFile() {
        MockedStatic<Paths> paths = mockStatic(Paths.class);
        MockedStatic<Files> files = mockStatic(Files.class);
        paths.when(() -> Paths.get(any())).thenReturn(null);
        files.when(() -> Files.deleteIfExists(any())).thenReturn(true);
        Mono<String> result = artifactService.deleteFile(Constants.artifact1, Constants.userAdmin);

        result = result.map((r) -> {
            paths.close();
            files.close();
            return r;
        });

        StepVerifier.create(result)
                .expectNext("File deleted successfully")
                .expectComplete()
                .verify();
    }

    @Test
    public void testDeleteFileNotUser() {
        Mono<String> result = artifactService.deleteFile(Constants.artifact2, Constants.userAdmin);

        StepVerifier.create(result)
                .expectError(ResponseStatusException.class);
    }

    @Test
    public void testDeleteFileUserNotAdmin() {
        Mono<String> result = artifactService.deleteFile(Constants.artifact2, Constants.userFaculty);

        StepVerifier.create(result)
                .expectError(ResponseStatusException.class);
    }

    @SuppressWarnings("resource")
    @Test
    public void testInitArtifacts() {
        MockedStatic<Paths> paths = mockStatic(Paths.class);
        MockedStatic<Files> files = mockStatic(Files.class);
        Path path = mock(Path.class);
        File file = mock(File.class);
        when(artifactRepository.count()).thenReturn(0l);
        when(artifactRepository.saveAndFlush(any())).thenReturn(Constants.artifact1);
        paths.when(() -> Paths.get(any())).thenReturn(path);
        files.when(() -> Files.exists(any())).thenReturn(true);
        files.when(() -> Files.walk(any())).thenReturn(List.of(path).stream());
        when(path.toFile()).thenReturn(file);
        when(file.delete()).thenReturn(true);
        files.when(() -> Files.createDirectories(any())).thenReturn(path);

        ReflectionTestUtils.invokeMethod(artifactService, "initArtifacts");

        verify(artifactRepository, times(1)).count();
        verify(path, times(1)).toFile();
        verify(file, times(1)).delete();
        verify(artifactRepository, times(1)).saveAndFlush(any());

        paths.close();
        files.close();
    }

    @SuppressWarnings("resource")
    @Test
    public void testInitArtifactsError() {
        MockedStatic<Paths> paths = mockStatic(Paths.class);
        MockedStatic<Files> files = mockStatic(Files.class);
        Path path = mock(Path.class);
        File file = mock(File.class);
        when(artifactRepository.count()).thenReturn(0l);
        paths.when(() -> Paths.get(any())).thenReturn(path);
        files.when(() -> Files.exists(any())).thenReturn(true);
        files.when(() -> Files.walk(any())).thenThrow(IOException.class);

        ReflectionTestUtils.invokeMethod(artifactService, "initArtifacts");

        verify(path, times(0)).toFile();
        verify(file, times(0)).delete();
        verify(artifactRepository, times(0)).saveAndFlush(any());

        paths.close();
        files.close();
    }

    @Test
    public void testProcessProfileImageExistingProfilePicture() throws Exception {
        // Create a valid square (1:1) PNG image
        BufferedImage img = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(img, "png", baos);
        byte[] imageBytes = baos.toByteArray();
        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        DataBuffer imageDataBuffer = dataBufferFactory.wrap(imageBytes);

        // Mock FilePart behavior
        FilePart filePart = mock(FilePart.class);
        when(filePart.content()).thenReturn(Flux.just(imageDataBuffer));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        lenient().when(filePart.headers()).thenReturn(headers);
        lenient().when(filePart.filename()).thenReturn("test.png");

        // Setup current user with an existing profile picture ID
        User user = mock(User.class);
        UUID userId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        lenient().when(user.getId()).thenReturn(userId);
        lenient().when(user.getProfilePictureId()).thenReturn(50); // existing picture id
        lenient().when(user.hasAdminPrivileges()).thenReturn(false);
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(user));

        // Simulate deletion of existing profile picture artifact
        Artifact artifactForDeletion = Artifact.builder()
                .id(50)
                .userId(userId)
                .fileLocation("/mocked/upload/directory/old.png")
                .build();
        lenient().when(artifactRepository.findById(any())).thenReturn(Optional.of(artifactForDeletion));

        // Stub the update call on the user repository to avoid NPE
        lenient().doNothing().when(userRepository).updateProfilePictureId(any(UUID.class), anyInt());

        // Create a temporary directory BEFORE entering the static mock block
        Path tempUploadDir = Files.createTempDirectory("testUploads");

        // Force-update the final field 'uploadDirectory' using reflection
        Field uploadDirectoryField = ArtifactService.class.getDeclaredField("uploadDirectory");
        uploadDirectoryField.setAccessible(true);
        uploadDirectoryField.set(artifactService, tempUploadDir.toString());

        try (MockedStatic<Files> filesMock = mockStatic(Files.class);
             MockedStatic<ImageIO> imageIOMock = mockStatic(ImageIO.class)) {

            // Stub file deletion and image write calls
            filesMock.when(() -> Files.deleteIfExists(any())).thenReturn(true);
            imageIOMock.when(() -> ImageIO.write(any(BufferedImage.class), anyString(), any(File.class)))
                    .thenReturn(true);

            // Simulate saving the new profile picture artifact
            Artifact savedArtifact = Artifact.builder()
                    .id(124)
                    .fileLocation("/mocked/upload/directory/unique.png")
                    .build();
            when(artifactRepository.save(any())).thenReturn(savedArtifact);
            lenient().when(artifactRepository.findByUniqueIdentifier(anyString()))
                    .thenReturn(Optional.of(savedArtifact));

            // Execute and verify
            Mono<Integer> result = artifactService.processProfileImage(filePart);
            StepVerifier.create(result)
                    .expectNext(124)
                    .expectComplete()
                    .verify();
        }
    }

    @Test
    public void testProcessProfileImageInvalidAspectRatio() throws Exception {
        // Create an image with a 2:1 aspect ratio (e.g. 200x100)
        BufferedImage img = new BufferedImage(200, 100, BufferedImage.TYPE_INT_RGB);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(img, "png", baos);
        byte[] imageBytes = baos.toByteArray();
        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        DataBuffer imageDataBuffer = dataBufferFactory.wrap(imageBytes);

        // Mock FilePart behavior
        FilePart filePart = mock(FilePart.class);
        when(filePart.content()).thenReturn(Flux.just(imageDataBuffer));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        when(filePart.headers()).thenReturn(headers);
        lenient().when(filePart.filename()).thenReturn("test.png");

        // Setup current user with a UUID (not int) and no existing profile picture
        User user = mock(User.class);
        UUID userId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        lenient().when(user.getId()).thenReturn(userId);
        lenient().when(user.getProfilePictureId()).thenReturn(null);
        lenient().when(user.hasAdminPrivileges()).thenReturn(false);
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(user));

        // Create a temporary upload directory and inject it into the service using ReflectionTestUtils.
        Path tempUploadDir = Files.createTempDirectory("testUploads");
        ReflectionTestUtils.setField(artifactService, "uploadDirectory", tempUploadDir.toString());

        // Override NonBlockingExecutor.execute so that it runs synchronously.
        try (MockedStatic<NonBlockingExecutor> nonBlockingMock = mockStatic(NonBlockingExecutor.class)) {
            nonBlockingMock.when(() -> NonBlockingExecutor.execute(any()))
                    .thenAnswer(invocation -> {
                        Callable<?> callable = invocation.getArgument(0);
                        try {
                            return Mono.just(callable.call());
                        } catch (Exception e) {
                            return Mono.error(e);
                        }
                    });

            // Execute and verify: expect a BAD_REQUEST error because the image aspect ratio (2) does not equal the expected (1).
            StepVerifier.create(artifactService.processProfileImage(filePart))
                    .expectErrorMatches(throwable ->
                            throwable instanceof ResponseStatusException &&
                                    ((ResponseStatusException) throwable).getStatusCode() == HttpStatus.BAD_REQUEST)
                    .verify();
        }
    }


    @Test
    public void testGetFileForbidden() {
        // Create an artifact (non-event) owned by a different user (UUID "00000000-0000-0000-0000-000000000002")
        Artifact artifact = Artifact.builder()
                .id(10)
                .fileLocation("/mocked/upload/directory/file.pdf")
                .type(ArtifactType.SUBMISSION)
                .userId(UUID.fromString("00000000-0000-0000-0000-000000000002"))
                .build();
        lenient().when(artifactRepository.findById(any())).thenReturn(Optional.of(artifact));

        // Create a current user with a different UUID ("00000000-0000-0000-0000-000000000001") and without faculty privileges
        User regularUser = mock(User.class);
        UUID userId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        lenient().when(regularUser.getId()).thenReturn(userId);
        lenient().when(regularUser.hasFacultyPrivileges()).thenReturn(false);
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(regularUser));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);

        // Set the upload directory using ReflectionTestUtils (this ensures normalization works)
        ReflectionTestUtils.setField(artifactService, "uploadDirectory", "/mocked/upload/directory");

        // Expect a forbidden error because the current user is not faculty and does not own the artifact.
        StepVerifier.create(artifactService.getFile("10", headers))
                .expectErrorMatches(throwable -> throwable instanceof ResponseStatusException &&
                        ((ResponseStatusException) throwable).getStatusCode() == HttpStatus.FORBIDDEN)
                .verify();
    }


    @Test
    public void testGetFileEventImage() {
        // Create an artifact of type EVENT_IMAGE
        Artifact artifact = Artifact.builder()
                .id(20)
                .fileLocation("/mocked/upload/directory/event.png")
                .type(ArtifactType.EVENT_IMAGE)
                .userId(UUID.fromString("00000000-0000-0000-0000-000000000002"))
                .build();
        when(artifactRepository.findById(any())).thenReturn(Optional.of(artifact));
        when(currentUserUtil.getCurrentUser()).thenReturn(Mono.just(Constants.userAdmin));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        // Use a temporary file to simulate an existing image file
        try {
            File tempFile = File.createTempFile("dummy", ".png");
            tempFile.deleteOnExit();
            artifact.setFileLocation(tempFile.getAbsolutePath());
            ReflectionTestUtils.setField(artifactService, "uploadDirectory", tempFile.getParent());

            Mono<ResponseEntity<Resource>> result = artifactService.getFile("20", headers);
            StepVerifier.create(result)
                    .assertNext(response -> {
                        assertEquals(HttpStatus.OK, response.getStatusCode());
                        FileSystemResource fsResource = (FileSystemResource) response.getBody();
                        assertNotNull(fsResource);
                        assertEquals(tempFile.getAbsolutePath(), fsResource.getPath());
                    })
                    .expectComplete()
                    .verify();
        } catch (IOException e) {
            fail("IOException during testGetFileEventImage: " + e.getMessage());
        }
    }

    @Test
    public void testGetFileNotFoundArtifact() {
        when(artifactRepository.findById(any())).thenReturn(Optional.empty());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);

        StepVerifier.create(artifactService.getFile("999", headers))
                .expectErrorMatches(throwable -> throwable instanceof ResponseStatusException &&
                        ((ResponseStatusException) throwable).getStatusCode() == HttpStatus.NOT_FOUND)
                .verify();
    }

    @Test
    public void testConcatenateDataBuffers() {
        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        byte[] data1 = "Hello".getBytes();
        byte[] data2 = "World".getBytes();
        DataBuffer buffer1 = dataBufferFactory.wrap(data1);
        DataBuffer buffer2 = dataBufferFactory.wrap(data2);
        List<DataBuffer> buffers = List.of(buffer1, buffer2);

        DataBuffer concatenated = ArtifactService.concatenateDataBuffers(buffers);
        byte[] concatenatedBytes = new byte[concatenated.readableByteCount()];
        concatenated.read(concatenatedBytes);
        String result = new String(concatenatedBytes);
        assertTrue(result.contains("Hello"));
        assertTrue(result.contains("World"));
    }

    @Test
    public void testGetFileExtension() {
        Optional<String> extJpeg = ArtifactService.getFileExtension(MediaType.IMAGE_JPEG);
        assertTrue(extJpeg.isPresent());
        assertEquals(".jpg", extJpeg.get());

        Optional<String> extPng = ArtifactService.getFileExtension(MediaType.IMAGE_PNG);
        assertTrue(extPng.isPresent());
        assertEquals(".png", extPng.get());

        Optional<String> extPdf = ArtifactService.getFileExtension(MediaType.APPLICATION_PDF);
        assertTrue(extPdf.isPresent());
        assertEquals(".pdf", extPdf.get());

        Optional<String> extDoc = ArtifactService.getFileExtension(MediaType.valueOf("application/msword"));
        assertTrue(extDoc.isPresent());
        assertEquals(".docx", extDoc.get());

        Optional<String> extUnknown = ArtifactService.getFileExtension(MediaType.TEXT_PLAIN);
        assertFalse(extUnknown.isPresent());
    }

    @Test
    public void testDeleteFileIOException() {
        Artifact artifact = Artifact.builder()
                .id(30)
                .fileLocation("/mocked/upload/directory/file.pdf")
                .userId(UUID.fromString("00000000-0000-0000-0000-000000000002"))
                .build();
        // Setup a user with admin privileges
        User user = mock(User.class);
        lenient().when(user.getId()).thenReturn(UUID.fromString("00000000-0000-0000-0000-000000000002"));
        lenient().when(user.hasAdminPrivileges()).thenReturn(true);

        // Override NonBlockingExecutor.execute to run synchronously
        try (MockedStatic<NonBlockingExecutor> nonBlockingMock = mockStatic(NonBlockingExecutor.class)) {
            nonBlockingMock.when(() -> NonBlockingExecutor.execute(any()))
                    .thenAnswer(invocation -> {
                        Callable<?> callable = invocation.getArgument(0);
                        try {
                            return Mono.just(callable.call());
                        } catch (Exception e) {
                            return Mono.error(e);
                        }
                    });
            // Now, force Files.deleteIfExists to throw an IOException
            try (MockedStatic<Files> filesMock = mockStatic(Files.class)) {
                filesMock.when(() -> Files.deleteIfExists(any()))
                        .thenThrow(new IOException("Deletion failed"));

                StepVerifier.create(artifactService.deleteFile(artifact, user))
                        .expectErrorMatches(throwable ->
                                throwable instanceof ResponseStatusException &&
                                        ((ResponseStatusException) throwable).getStatusCode() == HttpStatus.NOT_FOUND)
                        .verify();
            }
        }
    }


}
