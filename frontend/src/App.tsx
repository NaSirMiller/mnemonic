import "./style.css"; // Make sure your CSS file is in the same folder or adjust the path

function App() {
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
