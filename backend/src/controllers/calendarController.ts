import { google, calendar_v3 } from "googleapis";
import { Request, Response } from "express";

export const listEvents = async (req: Request, res: Response) => {
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: "No access token" });

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response: calendar_v3.Schema$Events = (
      await calendar.events.list({
        
        calendarId: "primary",  //Modify which calendar
        timeMin: new Date(Date.now()).toISOString(),   //Modify Minimum event date
        timeMax: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),   //Modify maximum event date
        maxResults: 10,     // Modify amount of results
        singleEvents: true,
        orderBy: "startTime",
      })
    ).data;

    res.json(response.items);
  } catch (error: any) {
    console.error("Calendar API error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
