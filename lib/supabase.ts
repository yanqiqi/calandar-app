import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Event = {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string
  date: string
  location: string
  color: string
  organizer: string
  attendees: string[]
  created_at: string
  updated_at: string
}
