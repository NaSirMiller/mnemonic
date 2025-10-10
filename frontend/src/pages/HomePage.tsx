import { useState } from "react";
import { Navbar } from "../components/Navbar";

export function HomePage() {

  // The following logic logs the users google calendar events. It's out of place, but
  // we can ultimately implement this to build our calendar display
  
  const [loading, setLoading] = useState(false);

  async function handleConnectCalendar() {
    const token = localStorage.getItem("googleAccessToken");
    if (!token) {
      console.warn("No Google access token found. Please log in first.");
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
        console.error("Failed to fetch calendar:", res.statusText);
        setLoading(false);
        return;
      }

      const events = await res.json();
      console.log("Upcoming Google Calendar events:", events);
    } catch (error) {
      console.error("Error fetching calendar:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar></Navbar>
      <main id="Home">
        <button type="button" onClick={handleConnectCalendar} disabled={loading}>
          {loading ? "Loading..." : "Connect Calendar"}
        </button>
      </main>
    </div>
  );
}
