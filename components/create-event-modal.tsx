"use client"

import type React from "react"

import { useState } from "react"
import { X, Calendar, Clock, MapPin, Users, FileText, User, Palette, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import type { Event } from "@/lib/supabase"

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateEvent: (
    eventData: Omit<Event, "id" | "created_at" | "updated_at">,
    imageData?: { file: File; thumbnail: Blob; compressed: Blob },
  ) => Promise<void>
  selectedDate?: Date
}

const colorOptions = [
  { name: "Blue", value: "bg-blue-500", color: "#3B82F6" },
  { name: "Green", value: "bg-green-500", color: "#10B981" },
  { name: "Purple", value: "bg-purple-500", color: "#8B5CF6" },
  { name: "Pink", value: "bg-pink-500", color: "#EC4899" },
  { name: "Orange", value: "bg-orange-500", color: "#F97316" },
  { name: "Red", value: "bg-red-500", color: "#EF4444" },
  { name: "Yellow", value: "bg-yellow-500", color: "#EAB308" },
  { name: "Indigo", value: "bg-indigo-500", color: "#6366F1" },
  { name: "Teal", value: "bg-teal-500", color: "#14B8A6" },
  { name: "Cyan", value: "bg-cyan-500", color: "#06B6D4" },
]

const timeSlotOptions = [
  { label: "早上 (6:00-12:00)", value: "morning", startTime: "08:00", endTime: "12:00" },
  { label: "下午 (12:00-18:00)", value: "afternoon", startTime: "14:00", endTime: "18:00" },
  { label: "晚上 (18:00-24:00)", value: "evening", startTime: "20:00", endTime: "23:00" },
]

export function CreateEventModal({ isOpen, onClose, onCreateEvent, selectedDate }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: selectedDate ? selectedDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    timeSlot: "morning",
    location: "",
    organizer: "You",
    attendees: "",
    color: "bg-blue-500",
  })
  const [imageData, setImageData] = useState<{ file: File; thumbnail: Blob; compressed: Blob } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError(null)
    }
  }

  const handleImageSelect = (data: { file: File; thumbnail: Blob; compressed: Blob }) => {
    setImageData(data)
    if (submitError) {
      setSubmitError(null)
    }
  }

  const handleImageRemove = () => {
    setImageData(null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = "Time slot is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const selectedTimeSlot = timeSlotOptions.find((slot) => slot.value === formData.timeSlot)

      const eventData = {
        ...formData,
        start_time: selectedTimeSlot?.startTime || "09:00",
        end_time: selectedTimeSlot?.endTime || "10:00",
        attendees: formData.attendees
          .split(",")
          .map((attendee) => attendee.trim())
          .filter((attendee) => attendee.length > 0),
        image_url: null,
        thumbnail_url: null,
        image_filename: null,
      }

      await onCreateEvent(eventData, imageData || undefined)

      // Reset form
      setFormData({
        title: "",
        description: "",
        date: selectedDate ? selectedDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        timeSlot: "morning",
        location: "",
        organizer: "You",
        attendees: "",
        color: "bg-blue-500",
      })
      setImageData(null)
      setErrors({})
      setSubmitError(null)

      onClose()
    } catch (error) {
      console.error("Failed to create event:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create event. Please try again."
      setSubmitError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form state when closing
      setErrors({})
      setSubmitError(null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Submit Error */}
          {submitError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Event Title *
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter event title"
              className={`w-full ${errors.title ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Date and Time Slot Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={`w-full ${errors.date ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            {/* Time Slot */}
            <div className="space-y-2">
              <Label htmlFor="timeSlot" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Slot *
              </Label>
              <Select
                value={formData.timeSlot}
                onValueChange={(value) => handleInputChange("timeSlot", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={`w-full ${errors.timeSlot ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlotOptions.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timeSlot && <p className="text-sm text-red-500">{errors.timeSlot}</p>}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Enter event location"
              className="w-full"
              disabled={isSubmitting}
            />
          </div>

          {/* Organizer */}
          <div className="space-y-2">
            <Label htmlFor="organizer" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4" />
              Organizer
            </Label>
            <Input
              id="organizer"
              type="text"
              value={formData.organizer}
              onChange={(e) => handleInputChange("organizer", e.target.value)}
              placeholder="Enter organizer name"
              className="w-full"
              disabled={isSubmitting}
            />
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <Label htmlFor="attendees" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Attendees
            </Label>
            <Input
              id="attendees"
              type="text"
              value={formData.attendees}
              onChange={(e) => handleInputChange("attendees", e.target.value)}
              placeholder="Enter attendee names separated by commas"
              className="w-full"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">Separate multiple attendees with commas</p>
          </div>

          {/* Image Upload */}
          <ImageUpload onImageSelect={handleImageSelect} onImageRemove={handleImageRemove} disabled={isSubmitting} />

          {/* Color Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Event Color
            </Label>
            <div className="grid grid-cols-5 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange("color", color.value)}
                  disabled={isSubmitting}
                  className={`relative w-full h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                    formData.color === color.value ? "border-gray-800 ring-2 ring-gray-400" : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color.color }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter event description"
              className="w-full min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200/50">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
