// src/utils/googleCalendar.ts
import { google, calendar_v3 } from "googleapis";
import { authRepo } from "../repositories/authRepository";
import { Task } from "../../../shared/models/task";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

/**
 * Safely converts a value to a Date object if possible
 */
function toValidDate(value: string | Date | undefined | null): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? null : date;
}


/**
 * Create a Google Calendar event for a task
 * @param userId - User ID stored in your system
 * @param task - Task object to convert into a calendar event
 * @returns The Google Calendar event created
 */
export async function createCalendarEvent(
  userId: string,
  task: Task
): Promise<calendar_v3.Schema$Event> {
  // 1. Get refresh token for the user
  const user = await authRepo.getUser(userId);
  if (!user?.refreshToken) {
    throw new Error("No refresh token found for user");
  }

  // 2. Set credentials with refresh token
  oauth2Client.setCredentials({ refresh_token: user.refreshToken });

  // 3. Get a fresh access token
  const accessTokenResponse = await oauth2Client.getAccessToken();
  const accessToken = accessTokenResponse?.token;
  if (!accessToken) throw new Error("Failed to retrieve access token");

  // 4. Initialize Calendar API
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // 5. Convert dueDate to valid Date
  const startDate = toValidDate(task.dueDate) || new Date();
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hour

  // 6. Prepare event
  const event: calendar_v3.Schema$Event = {
    summary: task.title,
    description: task.description ?? "",
    start: { dateTime: startDate.toISOString() },
    end: { dateTime: endDate.toISOString() },
    reminders: { useDefault: true },
  };

  // 7. Insert event
  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });

  return response.data;
}
