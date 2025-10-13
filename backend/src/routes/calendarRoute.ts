import express from "express";
import { google } from "googleapis";

const router = express.Router();

/**
 * POST /calendar/list
 * Fetches upcoming events from the user's primary Google Calendar.
 */
router.post("/list", async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    return res.status(400).json({ error: "Missing access token" });
  }

  try {
    // Initialize Google OAuth2 client with the access token
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth });

    // Fetch upcoming events
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];
    res.json(events);
  } catch (err) {
    console.error("Error fetching Google Calendar events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

/**
 * POST /calendar/add
 * Adds a new event to the user's primary Google Calendar.
 */
router.post("/add", async (req, res) => {
  const { accessToken, event } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: "Missing access token" });
  }

  if (!event) {
    return res.status(400).json({ error: "Missing event data" });
  }

  try {
    // Initialize Google OAuth2 client with the access token
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth });

    // Prepare the event data for insertion
    const newEvent = {
      summary: event.summary,
      description: event.description,
      start: {
        dateTime: event.startDateTime,
        timeZone: event.timeZone || "America/New_York",
      },
      end: {
        dateTime: event.endDateTime,
        timeZone: event.timeZone || "America/New_York",
      },
    };

    // Insert event into Google Calendar
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: newEvent,
    });

    res.status(201).json(response.data);
  } catch (err) {
    console.error("Error adding Google Calendar event:", err);
    res.status(500).json({ error: "Failed to add event" });
  }
});

export default router;
