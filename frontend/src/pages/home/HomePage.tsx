import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import { getTasks } from "../../services/tasksService";
import "./HomePage.css";
import type { Task } from "../../../../shared/models/task";

function HomePage() {
  const { accessToken, uid } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTaskList = async (userId: string) => {
    try {
      const tasksRetrieved = await getTasks(userId);
      setTasks(tasksRetrieved);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    if (!uid) {
      console.log("User id is not set on the home page.");
      return;
    }
    fetchTaskList(uid);
    console.log("Tasks retrieved!");
  }, [uid]);

  const [days, setDays] = useState<Date[]>([]);
  const [month] = useState(new Date().getMonth());
  const [events, setEvents] = useState<any[]>([]);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Build the calendar days
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay();
    const startDate = new Date(year, month, 1 - startDay);

    const tempDays: Date[] = [];
    for (let i = 0; i < 35; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      tempDays.push(day);
    }
    setDays(tempDays);
  }, [month]);

  const abrvMonth = (monthIndex: number) => months[monthIndex].slice(0, 3);

  const getDateKey = (date: Date) => date.toISOString().split("T")[0];

  // Fetch Google Calendar events
  useEffect(() => {
    if (!accessToken) return;

    const fetchCalendarEvents = async () => {
      try {
        const now = new Date();
        const timeMin = new Date(now.getFullYear(), month, 1).toISOString();
        const timeMax = new Date(now.getFullYear(), month + 1, 0).toISOString();

        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok)
          throw new Error(`Error fetching events: ${response.statusText}`);

        const data = await response.json();
        setEvents(data.items || []);
      } catch (error) {
        console.error("Failed to fetch Google Calendar events:", error);
      }
    };

    fetchCalendarEvents();
  }, [accessToken, month]);

  // Group events by date
  const eventsByDate: Record<string, any[]> = {};
  events.forEach((event) => {
    const startDateStr =
      event.start?.date || event.start?.dateTime?.split("T")[0];
    if (startDateStr) {
      if (!eventsByDate[startDateStr]) eventsByDate[startDateStr] = [];
      eventsByDate[startDateStr].push(event);
    }
  });


  /** 
   * Function to order tasks — filters out completed tasks and sorts by due date. 
   * Can be updated in the future to use different ordering logic.
   */
  const orderTasks = (tasks: Task[]): Task[] => {
    return tasks
      .filter((task) => !task.isComplete)
      .sort((a, b) => {
        if (!a.dueDate) return 1; // Tasks without due date go last
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime(); // Soonest due date first
      });
  };

  const orderedTasks = orderTasks(tasks);

  return (
    <div className="home-page">
      {/* LEFT SIDE — TASK LIST */}
      <div className="home-page-left">
        <div className="home-page-title">Tasks</div>
        <div className="home-page-task-type-cont">
          <div className="home-page-task-type">Name</div>
          <div className="home-page-task-type">Date</div>
        </div>
        <div className="home-page-task-cont">
          {orderedTasks.map((task, i) => (
            <div key={"task-" + i} className="home-page-task">
              <div className="home-page-task-name">{task.title}</div>
              <div className="home-page-task-date">
                {task.dueDate
                  ? task.dueDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "No due date"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE — CALENDAR */}
      <div className="home-page-right">
        <div className="home-page-title">Calendar</div>
        <div className="home-page-week-cont">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div key={day} className="home-page-week">
              {day}
            </div>
          ))}
        </div>
        <div className="home-page-calendar-cont">
          {days.map((day, i) => {
            const dayKey = getDateKey(day);
            const dayEvents = eventsByDate[dayKey] || [];

            return (
              <div
                key={"calendar-card-" + i}
                className="home-page-calendar-card"
              >
                <div className="home-page-date-label">
                  {day.getDate() === 1
                    ? abrvMonth(day.getMonth()) + " " + day.getDate()
                    : day.getDate()}
                </div>
                {dayEvents.map((event, j) => (
                  <div key={j} className="calendar-event">
                    {event.summary || "Untitled Event"}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
