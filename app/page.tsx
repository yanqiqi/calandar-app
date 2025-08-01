"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Settings,
  Menu,
  Clock,
  MapPin,
  Users,
  Calendar,
  Pause,
  Sparkles,
  X,
  Loader2,
} from "lucide-react"
import { useEvents } from "@/hooks/useEvents"
import { CreateEventModal } from "@/components/create-event-modal"
import type { Event } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { ImageViewer } from "@/components/image-viewer"
import './page.css';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAIPopup, setShowAIPopup] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showImageViewer, setShowImageViewer] = useState(false)
  const [viewerImage, setViewerImage] = useState<{ url: string; title: string } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [currentSlotEvents, setCurrentSlotEvents] = useState<Event[]>([])
  const [headerVisible, setHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Calendar state
  const [currentView, setCurrentView] = useState("week")
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 8))
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Refs for scroll handling
  const mainScrollRef = useRef<HTMLDivElement>(null)

  // Calculate date range based on current view and date
  const dateRange = useMemo(() => {
    const start = new Date(currentDate)
    const end = new Date(currentDate)

    switch (currentView) {
      case "day":
        break
      case "week":
        const dayOfWeek = start.getDay()
        start.setDate(start.getDate() - dayOfWeek)
        end.setDate(start.getDate() + 6)
        break
      case "month":
        start.setDate(1)
        end.setMonth(end.getMonth() + 1)
        end.setDate(0)
        break
    }

    return { start, end }
  }, [currentDate, currentView])

  // Use the events hook with dynamic date range
  const { events, loading, error, usingFallback, isSupabaseConfigured, createEvent, updateEvent, deleteEvent } =
    useEvents(dateRange.start, dateRange.end)

  // Handle scroll for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollElement = mainScrollRef.current
      if (!scrollElement) return

      const currentScrollY = scrollElement.scrollTop

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setHeaderVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setHeaderVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    const scrollElement = mainScrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll, { passive: true })
      return () => {
        scrollElement.removeEventListener("scroll", handleScroll)
      }
    }
  }, [lastScrollY])

  // Get current month and format it
  const getCurrentMonth = () => {
    return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const getCurrentDateString = () => {
    return currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })
  }

  // Get week dates based on current date
  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date.getDate())
    }
    return weekDates
  }

  // Get mini calendar days
  const getMiniCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const days = []

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  // Convert database events to display format
  const getEventsForWeekView = () => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)

    return events.map((event) => {
      const eventDate = new Date(event.date)
      const dayOfWeek = eventDate.getDay()

      return {
        ...event,
        day: dayOfWeek + 1,
        startTime: event.start_time,
        endTime: event.end_time,
      }
    })
  }

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  const goToPreviousWeek = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() - 7)
      return newDate
    })
  }

  const goToNextWeek = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + 7)
      return newDate
    })
  }

  const goToPreviousDay = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() - 1)
      return newDate
    })
  }

  const goToNextDay = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + 1)
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date(2025, 1, 8))
  }

  const handleMiniCalendarDayClick = (day) => {
    if (day) {
      const newDate = new Date(currentDate)
      newDate.setDate(day)
      setCurrentDate(newDate)
    }
  }

  // Navigation handlers based on current view
  const handlePrevious = () => {
    switch (currentView) {
      case "day":
        goToPreviousDay()
        break
      case "week":
        goToPreviousWeek()
        break
      case "month":
        goToPreviousMonth()
        break
    }
  }

  const handleNext = () => {
    switch (currentView) {
      case "day":
        goToNextDay()
        break
      case "week":
        goToNextWeek()
        break
      case "month":
        goToNextMonth()
        break
    }
  }

  // Handle create event
  const handleCreateEvent = async (
    eventData: Omit<Event, "id" | "created_at" | "updated_at">,
    imageData?: { file: File; thumbnail: Blob; compressed: Blob },
  ) => {
    try {
      if (usingFallback) {
        toast({
          title: "Demo Mode",
          description: "Event creation is disabled in demo mode. Configure Supabase to enable full functionality.",
          variant: "default",
        })
        return
      }

      await createEvent(eventData, imageData)
      toast({
        title: "Event Created",
        description: `"${eventData.title}" has been successfully created.`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleOpenCreateModal = () => {
    setShowCreateModal(true)
  }

  const handleCloseCreateModal = () => {
    setShowCreateModal(false)
  }

  useEffect(() => {
    setIsLoaded(true)

    const popupTimer = setTimeout(() => {
      setShowAIPopup(true)
    }, 3000)

    return () => clearTimeout(popupTimer)
  }, [])

  useEffect(() => {
    if (showAIPopup) {
      const text =
        "LLooks like you don't have that many meetings today. Shall I play some Hans Zimmer essentials to help you get into your Flow State?"
      let i = 0
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setTypedText((prev) => prev + text.charAt(i))
          i++
        } else {
          clearInterval(typingInterval)
        }
      }, 50)

      return () => clearInterval(typingInterval)
    }
  }, [showAIPopup])

  const handleEventClick = (event, slotEvents?: Event[]) => {
    if (slotEvents && slotEvents.length > 1) {
      setCurrentSlotEvents(slotEvents)
      const eventIndex = slotEvents.findIndex((e) => e.id === event.id)
      setCurrentEventIndex(eventIndex)
    } else {
      setCurrentSlotEvents([event])
      setCurrentEventIndex(0)
    }
    setSelectedEvent(event)
  }

  const handleNextEvent = () => {
    if (currentSlotEvents.length > 1) {
      const nextIndex = (currentEventIndex + 1) % currentSlotEvents.length
      setCurrentEventIndex(nextIndex)
      setSelectedEvent(currentSlotEvents[nextIndex])
    }
  }

  const handleImageClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation()
    if (event.image_url) {
      setViewerImage({ url: event.image_url, title: event.title })
      setShowImageViewer(true)
    }
  }

  // Sample calendar days for the week view
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const weekDates = getWeekDates()

  // 时间段定义
  const timeSlots = [
    { name: "早上", label: "Morning", time: "6:00-12:00", value: "morning" },
    { name: "下午", label: "Afternoon", time: "12:00-18:00", value: "afternoon" },
    { name: "晚上", label: "Evening", time: "18:00-24:00", value: "evening" },
  ]

  // Helper function to determine which time slot an event belongs to
  const getEventTimeSlot = (startTime: string) => {
    const hour = Number.parseInt(startTime.split(":")[0])
    if (hour >= 6 && hour < 12) return 0
    if (hour >= 12 && hour < 18) return 1
    return 2
  }

  // Group events by day and time slot
  const getGroupedEvents = () => {
    const displayEvents = getEventsForWeekView()
    const grouped: Record<string, Record<number, Event[]>> = {}

    displayEvents.forEach((event) => {
      const dayKey = `day-${event.day}`
      const slotIndex = getEventTimeSlot(event.startTime)

      if (!grouped[dayKey]) {
        grouped[dayKey] = {}
      }
      if (!grouped[dayKey][slotIndex]) {
        grouped[dayKey][slotIndex] = []
      }
      grouped[dayKey][slotIndex].push(event)
    })

    return grouped
  }

  const miniCalendarDays = getMiniCalendarDays()

  const myCalendars = [
    { name: "My Calendar", color: "bg-blue-500" },
    { name: "Work", color: "bg-green-500" },
    { name: "Personal", color: "bg-purple-500" },
    { name: "Family", color: "bg-orange-500" },
  ]

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const groupedEvents = getGroupedEvents()

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
        alt="Beautiful mountain landscape"
        fill
        className="object-cover"
        priority
      />

      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 md:py-6 transition-transform duration-300 ease-in-out bg-black/20 backdrop-blur-sm opacity-0 ${isLoaded ? "animate-fade-in" : ""} ${
          headerVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>
          <Menu className="hidden md:block h-6 w-6 text-white" />
          <span className="text-lg md:text-2xl font-semibold text-white drop-shadow-lg">Calendar</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
            <input
              type="text"
              placeholder="Search"
              className="rounded-full bg-white/10 backdrop-blur-sm pl-10 pr-4 py-2 text-white placeholder:text-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 w-32 md:w-auto"
            />
          </div>
          <Search className="sm:hidden h-5 w-5 text-white" />
          <Settings className="h-5 w-5 md:h-6 md:w-6 text-white drop-shadow-md" />
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md text-sm md:text-base">
            U
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main
        className={`relative h-screen w-full flex transition-all duration-300 ${headerVisible ? "pt-16 md:pt-20" : "pt-0"}`}
      >
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:relative z-40 w-64 h-full bg-white/10 backdrop-blur-lg p-4 shadow-xl border-r border-white/20 rounded-tr-3xl opacity-0 ${isLoaded ? "animate-fade-in" : ""} flex flex-col justify-between transition-transform duration-300 ease-in-out`}
          style={{ animationDelay: "0.4s" }}
        >
          <div>
            <button
              onClick={handleOpenCreateModal}
              className="mb-6 flex items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-3 text-white w-full hover:bg-blue-600 transition-colors text-sm md:text-base"
            >
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
              <span>Create</span>
            </button>

            {/* Mini Calendar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium text-sm md:text-base">{getCurrentMonth()}</h3>
                <div className="flex gap-1">
                  <button className="p-1 rounded-full hover:bg-white/20 transition-colors" onClick={goToPreviousMonth}>
                    <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </button>
                  <button className="p-1 rounded-full hover:bg-white/20 transition-colors" onClick={goToNextMonth}>
                    <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div key={i} className="text-xs text-white/70 font-medium py-1">
                    {day}
                  </div>
                ))}

                {miniCalendarDays.map((day, i) => (
                  <div
                    key={i}
                    className={`text-xs rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center cursor-pointer transition-colors ${
                      day === currentDate.getDate() ? "bg-blue-500 text-white" : "text-white hover:bg-white/20"
                    } ${!day ? "invisible" : ""}`}
                    onClick={() => handleMiniCalendarDayClick(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* My Calendars */}
            <div>
              <h3 className="text-white font-medium mb-3 text-sm md:text-base">My calendars</h3>
              <div className="space-y-2">
                {myCalendars.map((cal, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-sm ${cal.color}`}></div>
                    <span className="text-white text-xs md:text-sm">{cal.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Create Button */}
          <button
            onClick={handleOpenCreateModal}
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-blue-500 p-3 md:p-4 text-white w-12 h-12 md:w-14 md:h-14 self-start hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        {/* Calendar View */}
        <div
          className={`flex-1 flex flex-col opacity-0 ${isLoaded ? "animate-fade-in" : ""} overflow-hidden`}
          style={{ animationDelay: "0.6s" }}
        >
          {/* Calendar Controls */}
          <div className="flex items-center justify-between p-2 md:p-4 border-b border-white/20 flex-wrap gap-2 bg-black/20 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center gap-2 md:gap-4 flex-wrap">
              <button
                className="px-3 py-1.5 md:px-4 md:py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors text-sm md:text-base"
                onClick={goToToday}
              >
                Today
              </button>
              <div className="flex">
                <button
                  className="p-1.5 md:p-2 text-white hover:bg-white/10 rounded-l-md transition-colors"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                </button>
                <button
                  className="p-1.5 md:p-2 text-white hover:bg-white/10 rounded-r-md transition-colors"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-white">
                {currentView === "month" ? getCurrentMonth() : getCurrentDateString()}
              </h2>
              {loading && <Loader2 className="h-4 w-4 md:h-5 md:w-5 text-white animate-spin" />}
              {usingFallback && (
                <div className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-200 text-xs">
                  Demo Mode
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 rounded-md p-1">
              <button
                onClick={() => setCurrentView("day")}
                className={`px-2 py-1 md:px-3 md:py-1 rounded transition-colors ${currentView === "day" ? "bg-white/20" : "hover:bg-white/10"} text-white text-xs md:text-sm`}
              >
                Day
              </button>
              <button
                onClick={() => setCurrentView("week")}
                className={`px-2 py-1 md:px-3 md:py-1 rounded transition-colors ${currentView === "week" ? "bg-white/20" : "hover:bg-white/10"} text-white text-xs md:text-sm`}
              >
                Week
              </button>
              <button
                onClick={() => setCurrentView("month")}
                className={`px-2 py-1 md:px-3 md:py-1 rounded transition-colors ${currentView === "month" ? "bg-white/20" : "hover:bg-white/10"} text-white text-xs md:text-sm`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-2 md:mx-4 mt-2 md:mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-white text-sm">
              Error: {error}
            </div>
          )}
          {usingFallback && !error && (
            <div className="mx-2 md:mx-4 mt-2 md:mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-white text-sm">
              📝 Running in demo mode with sample data. Configure Supabase to enable full functionality.
            </div>
          )}

          {/* Week View */}
          <div className="flex-1 overflow-auto p-2 md:p-4" ref={mainScrollRef}>
            <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl min-h-full">
              {/* Week Header - Desktop */}
              <div className="hidden md:grid grid-cols-8 border-b border-white/20 sticky top-0 bg-white/10 backdrop-blur-sm z-10">
                <div className="p-1 md:p-2 text-center text-white/50 text-xs"></div>
                {weekDays.map((day, i) => (
                  <div key={i} className="p-1 md:p-2 text-center border-l border-white/20">
                    <div className="text-xs text-white/70 font-medium">{day}</div>
                    <div
                      className={`text-sm md:text-lg font-medium mt-1 text-white transition-colors ${weekDates[i] === currentDate.getDate() ? "bg-blue-500 rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center mx-auto text-xs md:text-base" : ""}`}
                    >
                      {weekDates[i]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Week Header - Mobile */}
              <div className="md:hidden border-b border-white/20 sticky top-0 bg-white/10 backdrop-blur-sm z-10">
                <div className="flex">
                  {/* Fixed time column header */}
                  <div className="w-20 flex-shrink-0 p-2 text-center text-white/50 text-xs bg-white/20"></div>
                  {/* Scrollable days header */}
                  <div className="flex-1 overflow-x-auto scrollbar-hide">
                    <div className="flex" style={{ width: "calc(7 * 25vw)" }}>
                      {weekDays.map((day, i) => (
                        <div
                          key={i}
                          className="flex-shrink-0 p-2 text-center border-l border-white/20"
                          style={{ width: "25vw" }}
                        >
                          <div className="text-xs text-white/70 font-medium">{day}</div>
                          <div
                            className={`text-sm font-medium mt-1 text-white transition-colors ${weekDates[i] === currentDate.getDate() ? "bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center mx-auto text-xs" : ""}`}
                          >
                            {weekDates[i]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Grid - Mobile */}
              <div className="md:hidden min-h-full">
                <div className="flex min-h-full">
                  {/* Fixed Time Labels Column */}
                  <div className="w-20 flex-shrink-0 text-white/70 bg-white/20 sticky left-0 z-10">
                    {timeSlots.map((slot, i) => (
                      <div
                        key={i}
                        className="border-b border-white/10 pr-2 text-center flex flex-col justify-center"
                        style={{ height: "25vw" }}
                      >
                        <div className="text-xs font-medium">{slot.name}</div>
                        <div className="text-xs text-white/50">{slot.time}</div>
                      </div>
                    ))}
                  </div>

                  {/* Scrollable Days Container */}
                  <div className="flex-1 overflow-x-auto scrollbar-hide">
                    <div className="flex" style={{ width: "calc(7 * 25vw)" }}>
                      {/* Days Columns */}
                      {Array.from({ length: 7 }).map((_, dayIndex) => (
                        <div
                          key={dayIndex}
                          className="flex-shrink-0 border-l border-white/20 flex flex-col"
                          style={{ width: "25vw" }}
                        >
                          {timeSlots.map((_, slotIndex) => {
                            const dayKey = `day-${dayIndex + 1}`
                            const slotEvents = groupedEvents[dayKey]?.[slotIndex] || []

                            return (
                              <div
                                key={slotIndex}
                                className="border-b border-white/10 p-2 relative flex items-center justify-center"
                                style={{ height: "25vw" }}
                              >
                                {slotEvents.length > 0 && slotEvents.length === 1 ? (
                                      <div
                                        className={`rounded-lg text-white text-xs shadow-lg cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl overflow-hidden ${
                                          slotEvents[0].image_url || slotEvents[0].thumbnail_url
                                            ? "p-0"
                                            : `${slotEvents[0].color} p-2`
                                        }`}
                                        style={{
                                          width: "calc(25vw - 16px)",
                                          height: "calc(25vw - 16px)",
                                          maxWidth: "120px",
                                          maxHeight: "120px",
                                        }}
                                        onClick={() => handleEventClick(slotEvents[0], slotEvents)}
                                      >
                                        {slotEvents[0].image_url || slotEvents[0].thumbnail_url ? (
                                          <div className="relative w-full h-full">
                                            <img
                                              src={
                                                slotEvents[0].thumbnail_url ||
                                                slotEvents[0].image_url ||
                                                "/placeholder.svg" ||
                                                "/placeholder.svg"
                                              }
                                              alt={slotEvents[0].title}
                                              className="w-full h-full object-cover rounded-lg"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-1 rounded-b-lg">
                                              <div className="font-medium text-xs text-white truncate text-center">
                                                {slotEvents[0].title}
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="h-full flex flex-col items-center justify-center text-center">
                                            <div className="font-medium text-xs leading-tight truncate w-full px-1">
                                              {slotEvents[0].title}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : ( slotEvents.length > 0 ?
                                      <div className="relative fix-pos">
                                        {slotEvents.slice(0, 3).map((event, eventIndex) => (
                                          <div
                                            key={event.id}
                                            className={`rounded-lg text-white text-xs shadow-lg cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl overflow-hidden absolute ${
                                              event.image_url || event.thumbnail_url ? "p-0" : `${event.color} p-2`
                                            }`}
                                            style={{
                                              width: "calc(25vw - 16px)",
                                              height: "calc(25vw - 16px)",
                                              maxWidth: "120px",
                                              maxHeight: "120px",
                                              top: `${eventIndex * 4}px`,
                                              left: `${eventIndex * 4}px`,
                                              zIndex: slotEvents.length - eventIndex,
                                              transform: `rotate(${eventIndex * 2 - 2}deg)`,
                                            }}
                                            onClick={() => handleEventClick(event, slotEvents)}
                                          >
                                            {event.image_url || event.thumbnail_url ? (
                                              <div className="relative w-full h-full">
                                                <img
                                                  src={event.thumbnail_url || event.image_url || "/placeholder.svg"}
                                                  alt={event.title}
                                                  className="w-full h-full object-cover rounded-lg"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-1 rounded-b-lg">
                                                  <div className="font-medium text-xs text-white truncate text-center">
                                                    {event.title}
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="h-full flex flex-col items-center justify-center text-center">
                                                <div className="font-medium text-xs leading-tight truncate w-full px-1">
                                                  {event.title}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        ))}

                                        {slotEvents.length > 3 && (
                                          <div
                                            className="absolute -bottom-1 -right-1 bg-white/90 text-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md"
                                            style={{ zIndex: slotEvents.length + 1 }}
                                          >
                                            +{slotEvents.length - 3}
                                          </div>
                                        )}

                                        <div
                                          className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md"
                                          style={{ zIndex: slotEvents.length + 2 }}
                                        >
                                          {slotEvents.length}
                                        </div>
                                      </div>
                                    :<div></div> )}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Event Modal */}
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={handleCloseCreateModal}
          onCreateEvent={handleCreateEvent}
          selectedDate={currentDate}
        />

        {/* AI Popup */}
        {showAIPopup && (
          <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-20 max-w-sm md:max-w-md">
            <div className="w-full relative bg-gradient-to-br from-blue-400/30 via-blue-500/30 to-blue-600/30 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow-xl border border-blue-300/30 text-white">
              <button
                onClick={() => setShowAIPopup(false)}
                className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-blue-300" />
                </div>
                <div className="min-h-[60px] md:min-h-[80px]">
                  <p className="text-sm md:text-base font-light">{typedText}</p>
                </div>
              </div>
              <div className="mt-4 md:mt-6 flex gap-3">
                <button
                  onClick={togglePlay}
                  className="flex-1 py-2 md:py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors font-medium"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowAIPopup(false)}
                  className="flex-1 py-2 md:py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors font-medium"
                >
                  No
                </button>
              </div>
              {isPlaying && (
                <div className="mt-4 flex items-center justify-between">
                  <button
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 md:px-4 py-2 md:py-2.5 text-white text-sm hover:bg-white/20 transition-colors"
                    onClick={togglePlay}
                  >
                    <Pause className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Pause Hans Zimmer</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${selectedEvent.color} p-4 md:p-6 rounded-lg shadow-xl max-w-md w-full relative`}>
              {currentSlotEvents.length > 1 && (
                <button
                  onClick={handleNextEvent}
                  className="absolute top-4 right-12 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors"
                  title="Next Event"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}

              <button
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors"
                onClick={() => setSelectedEvent(null)}
              >
                <X className="h-4 w-4" />
              </button>

              {selectedEvent.image_url && (
                <div className="mb-4">
                  <img
                    src={selectedEvent.image_url || "/placeholder.svg"}
                    alt={selectedEvent.title}
                    className="w-full h-32 md:h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setViewerImage({ url: selectedEvent.image_url!, title: selectedEvent.title })
                      setShowImageViewer(true)
                    }}
                  />
                </div>
              )}

              <h3 className="text-xl md:text-2xl font-bold mb-4 text-white pr-16">{selectedEvent.title}</h3>

              {currentSlotEvents.length > 1 && (
                <div className="text-white/80 text-sm mb-2">
                  Event {currentEventIndex + 1} of {currentSlotEvents.length}
                </div>
              )}

              {!selectedEvent.image_url && (
                <div className="space-y-3 text-white text-sm md:text-base">
                  <p className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    {`${selectedEvent.startTime} - ${selectedEvent.endTime}`}
                  </p>
                  <p className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    {selectedEvent.location}
                  </p>
                  <p className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="flex items-start">
                    <Users className="mr-2 h-4 w-4 md:h-5 md:w-5 mt-1" />
                    <span>
                      <strong>Attendees:</strong>
                      <br />
                      {selectedEvent.attendees?.join(", ") || "No attendees"}
                    </span>
                  </p>
                  <p>
                    <strong>Organizer:</strong> {selectedEvent.organizer}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedEvent.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Image Viewer */}
        <ImageViewer
          isOpen={showImageViewer}
          onClose={() => setShowImageViewer(false)}
          imageUrl={viewerImage?.url || ""}
          title={viewerImage?.title || ""}
        />
      </main>
    </div>
  )
}
