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

    if (!userDoc.exists) {
      console.log("No user document found");
      return res.json({ events: [] });
    }

    const data = userDoc.data();
    let accessToken = data?.googleTokens?.accessToken;
    const refreshToken = data?.googleTokens?.refreshToken;

    if (!refreshToken) {
      console.log("No refresh token found — user needs to reconnect calendar");
      return res.json({ events: [] });
    }

    // If no access token, try to refresh immediately
    if (!accessToken) {
      console.log("No access token — refreshing...");
      accessToken = await refreshAccessToken(refreshToken);

      if (!accessToken) {
        console.log("Failed to refresh access token");
        return res.json({ events: [] });
      }

      // Save new token
      await userRef.update({
        "googleTokens.accessToken": accessToken,
        "googleTokens.updatedAt": new Date().toISOString(),
      });
    }

    // Attempt to fetch calendar events
    let calendarResponse = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // If token expired, refresh and retry once
    if (calendarResponse.status === 401) {
      console.log("Access token expired — refreshing...");
      accessToken = await refreshAccessToken(refreshToken);

      if (!accessToken) {
        console.log("Failed to refresh expired token");
        return res.json({ events: [] });
      }

      // Save new token to Firestore
      await userRef.update({
        "googleTokens.accessToken": accessToken,
        "googleTokens.updatedAt": new Date().toISOString(),
      });

      // Retry fetching events
      calendarResponse = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    }

    // Parse Google Calendar API response
    const calendarData = (await calendarResponse.json()) as GoogleCalendarResponse;

    // Extract and map events cleanly
    const events =
      calendarData.items?.map((item) => ({
        title: item.summary || "Untitled Event",
        start: item.start?.dateTime || item.start?.date || "",
        end: item.end?.dateTime || item.end?.date || "",
      })) || [];

    return res.json({ events });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
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

    const hasAccess = !!data?.googleTokens?.accessToken;
    const hasRefresh = !!data?.googleTokens?.refreshToken;

    const calendarConnected = hasAccess || hasRefresh;
    return res.json({ calendarConnected });
  } catch (error) {
    console.error("Error checking calendar connection:", error);
    return res.json({ calendarConnected: false });
  }
}
