import { useEffect, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  type Event as RBCEvent,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

// --- Define interfaces for Google event data ---
interface GoogleEventDate {
  dateTime?: string;
  date?: string;
}

interface GoogleEvent {
  summary?: string;
  start: GoogleEventDate;
  end: GoogleEventDate;
}

// --- Localizer setup for date-fns ---
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// --- Main component ---
export default function GoogleCalendarView() {
  const [events, setEvents] = useState<RBCEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchGoogleEvents() {
      const token = localStorage.getItem("googleAccessToken");
      if (!token) {
        console.warn("No Google access token found.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/calendar/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: token }),
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.statusText}`);
        }

        const data: GoogleEvent[] = await res.json();

        // Convert Google events to React Big Calendar event format
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
    }

    fetchGoogleEvents();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Calendar</h1>
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600, width: "250%" }}
          toolbar={false}
        />
      )}
    </div>
  );
}
