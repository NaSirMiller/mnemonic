import "../style.css";
import { Navbar } from "../components/Navbar";

export function HomePage() {
  return (
    <div>
      <Navbar></Navbar>
      <main id="Home">
        <button type="button">Connect Calendar</button>
      </main>
    </div>
  );
}
