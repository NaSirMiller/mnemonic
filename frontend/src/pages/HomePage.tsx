import { useState, useEffect } from "react";
import { firebaseAuth } from "../firebase_utils";
import { EmbeddedCalendar } from "../components/EmbeddedCalendar";
import NavBar from "../components/NavBar/NavBar";
import "../style.css";

interface CalendarEvent {
  title: string;
  start: string | Date;
  end?: string | Date;
}

export function HomePage() {
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {

    // This function checks if a user's calendar is connected, and displays events if it is

    const checkAndFetchCalendar = async () => {
      const user = firebaseAuth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();

      // Check if calendar is connected
      const checkResponse = await fetch(
        "http://localhost:5000/api/auth/calendar/connected",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
      );
      const checkData = await checkResponse.json();

      if (checkData.calendarConnected) {
        setIsCalendarConnected(true);

        // Fetch events
        const eventsResponse = await fetch(
          "http://localhost:5000/api/auth/calendar/events",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          }
        );

        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events);
      }
    };

    checkAndFetchCalendar();
  }, []);

  // Redirect User to google auth for calendar access
  const handleConnectCalendar = async () => {
    const user = firebaseAuth.currentUser;
    if (!user) return;

    const idToken = await user.getIdToken();
    window.location.href = `http://localhost:5000/api/auth/google?token=${idToken}`;
  };

  return (
    <div>
      <NavBar />
      <main id="Home">
        {!isCalendarConnected ? (
          <div className="calendar-connect">
            <h2>Connect your Google Calendar</h2>
            <button
              type="button"
              onClick={handleConnectCalendar}
            > Connect Calendar
            </button>
          </div>
        ) : (
          <EmbeddedCalendar events={events} />
        )}
      </main>
    </div>
  );
}
