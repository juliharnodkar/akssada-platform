package com.akssada.platform.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminInitializer.class);

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:admin@akssada.org}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:changeme}")
    private String adminPassword;

    public AdminInitializer(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (adminUserRepository.findByEmail(adminEmail).isEmpty()) {
            logger.info("Initializing default admin user...");
            String hashedPassword = passwordEncoder.encode(adminPassword);
            AdminUser admin = new AdminUser(adminEmail, hashedPassword, "ADMIN");
            adminUserRepository.save(admin);
            logger.info("Default admin user created successfully.");
        }
    }
}
