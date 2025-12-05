import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import { getTasks } from "../../services/tasksService";
import { getCourses } from "../../services/coursesService";
import "./HomePage.css";

import type { Task } from "../../../../shared/models/task";
import type { Course } from "../../../../shared/models/course";

function HomePage() {
  const { accessToken, uid } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // --- Fetch tasks ---
  const fetchTaskList = async (userId: string) => {
    try {
      const tasksRetrieved = await getTasks(userId);
      setTasks(tasksRetrieved);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // --- Fetch courses ---
  const fetchCourses = async (userId: string) => {
    try {
      const coursesRetrieved = await getCourses(userId, null);
      setCourses(coursesRetrieved);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    if (!uid) return;
    fetchTaskList(uid);
    fetchCourses(uid);
  }, [uid]);

  // --- Calendar state ---
  const [days, setDays] = useState<Date[]>([]);
  const [month] = useState(new Date().getMonth());
  const [events, setEvents] = useState<any[]>([]);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  // --- Helper functions ---
  const abrvMonth = (monthIndex: number) => months[monthIndex].slice(0, 3);
  const getDateKey = (date: Date) => date.toISOString().split("T")[0];

  // Build calendar
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

  // --- Get course name helper ---
  const getCourseName = (courseId?: string) => {
    if (!courseId) return "";
    const course = courses.find((c) => c.courseId === courseId);
    return course?.courseName ?? courseId;
  };

  // --- Order tasks helper ---
  const orderTasks = (tasks: Task[]): Task[] =>
    tasks
      .filter((task) => !task.isComplete)
      .sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      });

  const orderedTasks = orderTasks(tasks);

  return (
    <div className="home-page">
      <div className="home-page-left">
        <div className="home-page-title">Tasks</div>

        <div className="home-page-task-type-cont">
          <div className="home-page-task-type">Name</div>
          <div className="home-page-task-type">Date</div>
        </div>

        <div className="home-page-task-cont">
          {orderedTasks.map((task, i) => (
            <div key={"task-" + i} className="home-page-task">
              <div className="home-page-task-name tooltip">
                {task.title}
                <span className="tooltip-text">
                  {getCourseName(task.courseId)}
                </span>
              </div>

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

      {/* Calendar */}
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
              <div key={"calendar-card-" + i} className="home-page-calendar-card">
                <div className="home-page-date-label">
                  {day.getDate() === 1
                    ? abrvMonth(day.getMonth()) + " " + day.getDate()
                    : day.getDate()}
                </div>

                {dayEvents.map((event, j) => (
                  <div key={j} className="calendar-event">
                    <span className="calendar-event-text">
                      {event.summary || "Untitled Event"}
                    </span>
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
