import { Request, Response } from "express";
import admin from "../firebase_admin";
import fetch from "node-fetch";
import { refreshAccessToken } from "../utils/googleTokens";

// Type for Google Calendar event
interface GoogleCalendarEvent {
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

// Type for the Google Calendar API response
interface GoogleCalendarResponse {
  items: GoogleCalendarEvent[];
}

// Get user calendar events for display
export async function getCalendarEvents(req: Request, res: Response) {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: "ID token missing" });

  try {
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get user's Google tokens from Firestore
    const userRef = admin.firestore().collection("users").doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return res.json({ events: [] });

    const data = userDoc.data();
    let accessToken = data?.googleTokens?.accessToken;
    const refreshToken = data?.googleTokens?.refreshToken;

    if (!accessToken && !refreshToken) return res.json({ events: [] });

    // Automatically refresh access token if missing
    if (refreshToken && !accessToken) {
      accessToken = await refreshAccessToken(refreshToken);

      // Save new access token to Firestore
      await userRef.update({
        "googleTokens.accessToken": accessToken,
        "googleTokens.updatedAt": new Date().toISOString(),
      });
    }

    // Fetch events from Google Calendar
    const calendarResponse = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const calendarData = (await calendarResponse.json()) as GoogleCalendarResponse;

    const events =
      calendarData.items?.map((item) => ({
        title: item.summary,
        start: item.start?.dateTime || item.start?.date,
        end: item.end?.dateTime || item.end?.date,
      })) || [];

    return res.json({ events });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ events: [] });
  }
}

// Function to track if calendar is connected, for use in homepage
export async function isCalendarConnected(req: Request, res: Response) {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ calendarConnected: false });

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    const data = userDoc.data();

    const calendarConnected = !!data?.googleTokens?.accessToken || !!data?.googleTokens?.refreshToken;
    return res.json({ calendarConnected });
  } catch (error) {
    console.error(error);
    return res.json({ calendarConnected: false });
  }
}
