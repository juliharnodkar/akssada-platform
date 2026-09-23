-- V9: Add additional_image_urls and updated_at to story, and add missing setters migration context
ALTER TABLE story ADD COLUMN IF NOT EXISTS additional_image_urls TEXT[];
ALTER TABLE story ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
