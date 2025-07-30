-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255),
  color VARCHAR(50) DEFAULT 'bg-blue-500',
  organizer VARCHAR(255),
  attendees TEXT[], -- Array of attendee names
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster date queries
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Create index for date range queries
CREATE INDEX IF NOT EXISTS idx_events_date_range ON events(date, start_time);

-- Enable Row Level Security (optional)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on events" ON events
  FOR ALL USING (true);
