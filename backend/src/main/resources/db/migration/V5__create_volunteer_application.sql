CREATE TABLE volunteer_application (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(255) NOT NULL,
    email               VARCHAR(255) NOT NULL,
    phone               VARCHAR(20)  NOT NULL,
    location            VARCHAR(255) NOT NULL,
    skills              VARCHAR(500),
    areas_of_interest   VARCHAR(500),
    availability        VARCHAR(255),
    message             TEXT,
    status              VARCHAR(50)  NOT NULL DEFAULT 'NEW',
    submitted_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_volunteer_application_status ON volunteer_application (status);
