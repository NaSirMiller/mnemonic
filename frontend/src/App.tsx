import { useEffect } from "react";
import "./style.css"; // Make sure your CSS file is in the same folder or adjust the path

function App() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "google-signin-client_id";
    document.head.appendChild(meta);

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);
  return (
    <div>
      <nav>
        <a href="/">Home</a>
        <a href="/Courses">Courses</a>
        <a href="/Tasks">Tasks</a>
      </nav>

      <main id="Home">
        <button type="button">Connect Calendar</button>
      </main>
    </div>
  );
}

export default App;
