-- Seeds a single admin account for local development and initial deployment.
-- Password hash below is BCrypt for the placeholder password "ChangeMe123!".
-- This MUST be rotated (via a real password-change flow, added in a later
-- phase) before this system is used with real submissions in production.
INSERT INTO admin_user (email, password_hash, role)
VALUES (
    'admin@akssada.org',
    '$2b$10$7V45jmWm1MN67DVqBrj12OUPdDlem8LiRU24EF.3oTeqQ5aQA/4WS',
    'ADMIN'
);
