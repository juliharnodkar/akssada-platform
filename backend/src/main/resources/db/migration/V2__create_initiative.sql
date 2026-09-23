CREATE TABLE initiative (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(255) NOT NULL,
    slug             VARCHAR(255) NOT NULL,
    focus_area       VARCHAR(100) NOT NULL,
    summary          TEXT         NOT NULL,
    content          TEXT         NOT NULL,
    cover_image_url  TEXT,
    is_published     BOOLEAN      NOT NULL DEFAULT false,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT uq_initiative_slug UNIQUE (slug)
);

CREATE INDEX idx_initiative_is_published ON initiative (is_published);
