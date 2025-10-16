// src/pages/HomePage.tsx
import "../style.css";
import NavBar from "../components/NavBar/NavBar";
import { EmbeddedCalendar } from "../components/EmbeddedCalendar";

export function HomePage() {
  return (
    <div>
      <NavBar></NavBar>
      <main id="Home">
        <EmbeddedCalendar />
      </main>
    </div>
  );
}
