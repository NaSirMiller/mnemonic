import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../style.css"; // make sure this import exists

interface EmbeddedCalendarProps {
  events?: { title: string; start: string | Date; end?: string | Date }[];
}

export function EmbeddedCalendar({ events = [] }: EmbeddedCalendarProps) {
  return (
    <div className="calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: ""
        }}
        events={events}
        height="auto"
      />
    </div>
  );
}
