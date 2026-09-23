package com.akssada.platform.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class StorageService {

    private static final Logger logger = LoggerFactory.getLogger(StorageService.class);
    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".webp", ".gif");

    private final S3Client s3Client;
    private final String bucketName;
    private final String publicBaseUrl;

    public StorageService(
            @Value("${S3_ACCESS_KEY:}") String accessKey,
            @Value("${S3_SECRET_KEY:}") String secretKey,
            @Value("${S3_REGION:us-east-1}") String region,
            @Value("${S3_BUCKET_NAME:}") String bucketName,
            @Value("${S3_ENDPOINT:}") String endpoint,
            @Value("${S3_PUBLIC_URL:}") String publicBaseUrl
    ) {
        this.bucketName = bucketName;
        this.publicBaseUrl = publicBaseUrl.isBlank() && !bucketName.isBlank()
                ? "https://" + bucketName + ".s3." + region + ".amazonaws.com"
                : publicBaseUrl;

        if (accessKey.isBlank() || secretKey.isBlank() || bucketName.isBlank()) {
            logger.warn("S3 credentials or bucket name are missing. Media uploads will be disabled.");
            this.s3Client = null;
            return;
        }

        var credentials = StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey)
        );

        var builder = S3Client.builder()
                .credentialsProvider(credentials)
                .region(Region.of(region))
                .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(!endpoint.isBlank()).build());

        if (!endpoint.isBlank()) {
            builder.endpointOverride(URI.create(endpoint));
        }

        this.s3Client = builder.build();
    }

    public String upload(MultipartFile file) throws IOException {
        if (this.s3Client == null) {
            throw new IllegalStateException("Media storage is not configured. Please set S3 environment variables.");
        }
        validateFile(file);

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload";
        String extension = getExtension(originalFilename);
        String objectKey = "uploads/" + UUID.randomUUID() + extension;

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
        logger.info("Uploaded file to S3: {}", objectKey);

        return publicBaseUrl + "/" + objectKey;
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("File exceeds maximum size of 5MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Unsupported file type. Allowed: JPEG, PNG, WebP, GIF");
        }
        String name = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        boolean extAllowed = ALLOWED_EXTENSIONS.stream().anyMatch(name::endsWith);
        if (!extAllowed) {
            throw new IllegalArgumentException("Unsupported file extension");
        }
    }

    private String getExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        return lastDot >= 0 ? filename.substring(lastDot).toLowerCase() : "";
    }
}
