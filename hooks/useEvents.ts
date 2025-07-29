"use client"

import { useState, useEffect } from "react"
import { supabase, type Event } from "@/lib/supabase"

export function useEvents(startDate: Date, endDate: Date) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      const startDateStr = startDate.toISOString().split("T")[0]
      const endDateStr = endDate.toISOString().split("T")[0]

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("date", startDateStr)
        .lte("date", endDateStr)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true })

      if (error) throw error

      setEvents(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching events:", err)
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async (eventData: Omit<Event, "id" | "created_at" | "updated_at">) => {
    try {
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
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  }
}
