import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";

function HomePage() {
    const { accessToken } = useAuth();

    // Local hardcoded tasks
    const tasks = [
        { name: "Homework 1", date: "Nov 1" },
        { name: "Homework 2", date: "Nov 2" },
        { name: "Homework 3", date: "Nov 3" },
        { name: "Homework 4", date: "Nov 4" },
        { name: "Homework 5", date: "Nov 5" },
        { name: "Homework 6", date: "Nov 6" },
        { name: "Homework 7", date: "Nov 7" },
        { name: "Homework 8", date: "Nov 8" },
        { name: "Homework 9", date: "Nov 9" },
        { name: "Homework 10", date: "Nov 10" },
        { name: "Homework 11", date: "Nov 11" },
        { name: "Homework 12", date: "Nov 12" },
        { name: "Homework 13", date: "Nov 13" },
        { name: "Homework 14", date: "Nov 14" },
        { name: "Homework 15", date: "Nov 15" },
        { name: "Homework 16", date: "Nov 16" },
        { name: "Homework 17", date: "Nov 17" },
        { name: "Homework 18", date: "Nov 18" },
        { name: "Homework 19", date: "Nov 19" },
        { name: "Homework 20", date: "Nov 19" },
        { name: "Homework 21", date: "Nov 19" },
        { name: "Homework 22", date: "Nov 19" },
        { name: "Homework 23", date: "Nov 19" },
        { name: "Homework 24", date: "Nov 19" },
        { name: "Homework 25", date: "Nov 19" },
        { name: "Homework Mnemonic Data Structures 99999999", date: "Nov 11" }
    ];

    const [days, setDays] = useState<Date[]>([]);
    const [month, setMonth] = useState(new Date().getMonth());
    const [events, setEvents] = useState<any[]>([]);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
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

                if (!response.ok) throw new Error(`Error fetching events: ${response.statusText}`);

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
        const startDateStr = event.start?.date || event.start?.dateTime?.split("T")[0];
        if (startDateStr) {
            if (!eventsByDate[startDateStr]) eventsByDate[startDateStr] = [];
            eventsByDate[startDateStr].push(event);
        }
    });

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
                    {tasks.map((task, i) => (
                        <div key={"task-" + i} className="home-page-task">
                            <div className="home-page-task-name">{task.name}</div>
                            <div className="home-page-task-date">{task.date}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE — CALENDAR */}
            <div className="home-page-right">
                <div className="home-page-title">Calendar</div>
                <div className="home-page-week-cont">
                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                        <div key={day} className="home-page-week">{day}</div>
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
