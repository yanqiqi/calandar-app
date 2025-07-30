import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client if environment variables are missing
const createMockClient = () => ({
  from: () => ({
    select: () => ({
      gte: () => ({
        lte: () => ({
          order: () => ({
            order: () => Promise.resolve({ data: [], error: new Error("Supabase not configured") }),
          }),
        }),
      }),
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
      }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        }),
      }),
    }),
    delete: () => ({
      eq: () => Promise.resolve({ error: new Error("Supabase not configured") }),
    }),
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
      getPublicUrl: () => ({ data: { publicUrl: "" } }),
      remove: () => Promise.resolve({ error: new Error("Supabase not configured") }),
      createBucket: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
    }),
  },
})

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : createMockClient()

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Initialize storage bucket
export const initializeStorage = async () => {
  if (!isSupabaseConfigured) return

  try {
    // Check if bucket exists, create if it doesn't
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.warn("Could not list buckets:", listError.message)
      return
    }

    const eventImagesBucket = buckets?.find((bucket) => bucket.id === "event-images")

    if (!eventImagesBucket) {
      const { error: createError } = await supabase.storage.createBucket("event-images", {
        public: true,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
        fileSizeLimit: 10485760, // 10MB
      })

      if (createError) {
        console.warn("Could not create bucket:", createError.message)
      } else {
        console.log("Created event-images bucket successfully")
      }
    }
  } catch (error) {
    console.warn("Storage initialization error:", error)
  }
}

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
  image_url?: string | null
  thumbnail_url?: string | null
  image_filename?: string | null
  created_at: string
  updated_at: string
}
