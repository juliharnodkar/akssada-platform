CREATE TABLE partnership_inquiry (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name  VARCHAR(255) NOT NULL,
    contact_name       VARCHAR(255) NOT NULL,
    email              VARCHAR(255) NOT NULL,
    phone              VARCHAR(20),
    partnership_type   VARCHAR(50)  NOT NULL,
    message            TEXT         NOT NULL,
    status             VARCHAR(50)  NOT NULL DEFAULT 'NEW',
    submitted_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_partnership_inquiry_status ON partnership_inquiry (status);
