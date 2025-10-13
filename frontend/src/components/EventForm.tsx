import { useState } from "react";

interface EventFormProps {
  onAddEvent: (title: string, start: string, end: string, description: string) => void;
  adding?: boolean;
}

export default function EventForm({ onAddEvent, adding = false }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent(title, startDateTime, endDateTime, description);
    setTitle("");
    setStartDateTime("");
    setEndDateTime("");
    setDescription("");
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={startDateTime}
        onChange={(e) => setStartDateTime(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={endDateTime}
        onChange={(e) => setEndDateTime(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="submit"
        disabled={adding}
      >
        {adding ? "Adding..." : "Add Event"}
      </button>
    </form>
  );
}
