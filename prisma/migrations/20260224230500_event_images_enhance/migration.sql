-- Add richer image fields to Event
ALTER TABLE "Event"
ADD COLUMN "cover_image_url" TEXT,
ADD COLUMN "image_urls" TEXT[];

-- Migrate existing gallery values from legacy "images" column
UPDATE "Event"
SET "image_urls" = COALESCE("images", ARRAY[]::TEXT[])
WHERE "image_urls" IS NULL;

ALTER TABLE "Event"
ALTER COLUMN "image_urls" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "image_urls" SET NOT NULL;

ALTER TABLE "Event"
DROP COLUMN "images";
