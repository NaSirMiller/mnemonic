import "../style.css";
import { Navbar } from "../components/Navbar";
import GoogleCalendarView from "../components/GoogleCalendarView";

export function HomePage() {
  return (
    <div>
      <Navbar></Navbar>
      <main id="Home">
        <GoogleCalendarView />
      </main>
    </div>
  );
}
