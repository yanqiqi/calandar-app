"use client"

import { useState, useEffect } from "react"
import { supabase, isSupabaseConfigured, type Event } from "@/lib/supabase"
import { getEventsByDateRange } from "@/lib/fallback-events"

export function useEvents(startDate: Date, endDate: Date) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      // If Supabase is not configured, use fallback data
      if (!isSupabaseConfigured) {
        console.warn("Supabase not configured, using fallback data")
        const fallbackEvents = getEventsByDateRange(startDate, endDate)
        setEvents(fallbackEvents)
        setUsingFallback(true)
        return
      }

      const startDateStr = startDate.toISOString().split("T")[0]
      const endDateStr = endDate.toISOString().split("T")[0]

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("date", startDateStr)
        .lte("date", endDateStr)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true })

      if (error) {
        // If Supabase fails, fall back to local data
        console.warn("Supabase query failed, using fallback data:", error.message)
        const fallbackEvents = getEventsByDateRange(startDate, endDate)
        setEvents(fallbackEvents)
        setUsingFallback(true)
        return
      }

      setEvents(data || [])
      setUsingFallback(false)
    } catch (err) {
      console.warn("Error fetching events, using fallback data:", err)
      // Use fallback data on any error
      const fallbackEvents = getEventsByDateRange(startDate, endDate)
      setEvents(fallbackEvents)
      setUsingFallback(true)
      setError(null) // Clear error since we have fallback data
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async (eventData: Omit<Event, "id" | "created_at" | "updated_at">) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase not configured - cannot create events")
      }

      const { data, error } = await supabase.from("events").insert([eventData]).select().single()

      if (error) throw error

      setEvents((prev) =>
        [...prev, data].sort((a, b) => {
          const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
          if (dateCompare !== 0) return dateCompare
          return a.start_time.localeCompare(b.start_time)
        }),
      )

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event")
      throw err
    }
  }

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase not configured - cannot update events")
      }

      const { data, error } = await supabase
        .from("events")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      setEvents((prev) => prev.map((event) => (event.id === id ? data : event)))

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event")
      throw err
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase not configured - cannot delete events")
      }

      const { error } = await supabase.from("events").delete().eq("id", id)

      if (error) throw error

      setEvents((prev) => prev.filter((event) => event.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event")
      throw err
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [startDate, endDate])

  return {
    events,
    loading,
    error,
    usingFallback,
    isSupabaseConfigured,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  }
}
