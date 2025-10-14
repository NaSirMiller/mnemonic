import "../style.css";
import NavBar from "../components/NavBar/NavBar";

export function HomePage() {
  return (
    <div>
      <NavBar></NavBar>
      <main id="Home">
        <button type="button">Connect Calendar</button>
      </main>
    </div>
  );
}
