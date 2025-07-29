-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on events" ON events;

-- Create more specific policies for events table
CREATE POLICY "Enable read access for all users" ON events
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON events
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON events
  FOR DELETE USING (true);

-- Create storage bucket for event images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for event-images bucket
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Allow authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "Allow authenticated update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'event-images');

CREATE POLICY "Allow authenticated delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'event-images');

-- Grant necessary permissions
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.buckets TO anon;
