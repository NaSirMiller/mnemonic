import express from "express";
import { google } from "googleapis";

const router = express.Router();

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

    // Fetch upcoming events from the user's primary calendar
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(), // only future events
      maxResults: 50, //max 50 results
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

export default router;
