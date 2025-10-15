import "../style.css";
import NavBar from "../components/NavBar/NavBar";
import GoogleCalendarView from "../components/GoogleCalendarView";

export function HomePage() {
  return (
    <div>
      <NavBar></NavBar>
      <main id="Home">
        <GoogleCalendarView />
      </main>
    </div>
  );
}
