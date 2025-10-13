import { useEffect, useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer, type Event as RBCEvent } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventForm from "./EventForm";

// --- Interfaces ---
interface GoogleEventDate {
  dateTime?: string;
  date?: string;
}

interface GoogleEvent {
  summary?: string;
  start: GoogleEventDate;
  end: GoogleEventDate;
}

// --- Localizer ---
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export default function GoogleCalendarView() {
  const [events, setEvents] = useState<RBCEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  // --- Fetch events ---
  const fetchGoogleEvents = useCallback(async () => {
    const token = localStorage.getItem("googleAccessToken");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/calendar/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token }),
      });

      if (!res.ok) throw new Error(`Failed to fetch events: ${res.statusText}`);

      const data: GoogleEvent[] = await res.json();
      const formattedEvents: RBCEvent[] = data.map((ev) => ({
        title: ev.summary || "No Title",
        start: new Date(ev.start.dateTime || ev.start.date || ""),
        end: new Date(ev.end.dateTime || ev.end.date || ""),
        allDay: !ev.start.dateTime,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching Google Calendar events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoogleEvents();
  }, [fetchGoogleEvents]);

  // --- Add new event ---
  const handleAddEvent = async (title: string, start: string, end: string, description: string) => {
    const token = localStorage.getItem("googleAccessToken");
    if (!token) return;

    if (!title || !start || !end) {
      alert("Please fill in title, start, and end times.");
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate <= startDate) {
      alert("End time must be after start time.");
      return;
    }

    setAdding(true);
    try {
      const newEvent = {
        summary: title,
        description,
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        timeZone: "America/New_York",
      };

      const res = await fetch("http://localhost:5000/calendar/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token, event: newEvent }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to add event: ${res.status} - ${errText}`);
      }

      setEvents((prev) => [...prev, { title, start: startDate, end: endDate, allDay: false }]);
    } catch (error) {
      console.error("Error adding Google Calendar event:", error);
      alert("Failed to add event. Check console for details.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="calendar-page">
      <h1 className="calendar-title">Calendar</h1>

      {/* --- Event Submission Form (To Be Deleted) ---*/}
      <EventForm onAddEvent={handleAddEvent} adding={adding} />

      {/* --- Calendar --- */}
      <div className="calendar-wrapper">
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600, width: "100%" }} // fixed height
            toolbar={false}
          />
        )}
      </div>
    </div>
  );
}
