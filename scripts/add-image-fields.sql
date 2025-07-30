-- Add image fields to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS image_filename TEXT;

-- Create index for events with images
CREATE INDEX IF NOT EXISTS idx_events_with_images ON events(image_url) WHERE image_url IS NOT NULL;

-- Update existing events to have null image fields (if needed)
UPDATE events SET image_url = NULL, thumbnail_url = NULL, image_filename = NULL WHERE image_url IS NULL;
