CREATE TABLE story (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(255) NOT NULL,
    slug             VARCHAR(255) NOT NULL,
    content          TEXT         NOT NULL,
    cover_image_url  TEXT,
    author_name      VARCHAR(255),
    category         VARCHAR(100),
    initiative_id    UUID REFERENCES initiative (id),
    is_published     BOOLEAN      NOT NULL DEFAULT false,
    published_at     TIMESTAMPTZ,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT uq_story_slug UNIQUE (slug)
);

CREATE INDEX idx_story_initiative_id ON story (initiative_id);
CREATE INDEX idx_story_published_at ON story (is_published, published_at DESC);
