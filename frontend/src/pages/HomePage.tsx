import "../style.css";
import Navbar from "../NavBar/NavBar";
import GoogleCalendarView from "../components/GoogleCalendarView";

export function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      <main id="Home" className="main-content">
        <GoogleCalendarView />
      </main>
    </div>
  );
}
