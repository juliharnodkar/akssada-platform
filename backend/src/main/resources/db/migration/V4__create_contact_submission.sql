CREATE TABLE contact_submission (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    subject       VARCHAR(255) NOT NULL,
    message       TEXT         NOT NULL,
    status        VARCHAR(50)  NOT NULL DEFAULT 'NEW',
    submitted_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_submission_status ON contact_submission (status);
