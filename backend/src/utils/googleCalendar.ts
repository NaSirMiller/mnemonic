import { google, calendar_v3 } from "googleapis";
import { authRepo } from "../repositories/authRepository";
import { Task } from "../../../shared/models/task";
import { DateTime } from "luxon";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

/**
 * Safely converts a value to a Date object if possible
 */
function toValidDate(value: any): Date | null {
  if (!value) return null;
  if (value?.toDate && typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;

  if (typeof value === "object") {
    if ("_seconds" in value) return new Date(value._seconds * 1000);
    if ("seconds" in value) return new Date(value.seconds * 1000);
  }

  if (typeof value === "string") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

/**
 * Create a Google Calendar event
 */
export async function createCalendarEvent(
  userId: string,
  task: Task
): Promise<calendar_v3.Schema$Event> {
  const user = await authRepo.getUser(userId);
  if (!user?.refreshToken) throw new Error("No refresh token found for user");

  oauth2Client.setCredentials({ refresh_token: user.refreshToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const startDateUTC = toValidDate(task.dueDate);
  if (!startDateUTC) throw new Error("Invalid dueDate for task");

  const startDateNY = DateTime.fromJSDate(startDateUTC, { zone: "UTC" })
    .setZone("America/New_York");

  const event: Omit<calendar_v3.Schema$Event, "id"> = {
    summary: task.title,
    description: task.description ?? "",
    start: { dateTime: startDateNY.toISO(), timeZone: "America/New_York" },
    end: { dateTime: startDateNY.toISO(), timeZone: "America/New_York" },
    reminders: { useDefault: true },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });

  return response.data;
}

/**
 * Update an existing Google Calendar event if title, description, or dueDate changed
 */
export async function updateCalendarEvent(
  userId: string,
  task: Task,
  previousTask: Task
) {
  // Use previousTask.googleEventId because the incoming task payload doesn't include it
  const googleEventId = previousTask.googleEventId;
  if (!googleEventId) {
    console.log("No Google Calendar event to update");
    return; // nothing to update
  }

  const prevDueDate = toValidDate(previousTask.dueDate);
  const currDueDate = toValidDate(task.dueDate);
  const dueDateChanged =
    !prevDueDate || !currDueDate || prevDueDate.getTime() !== currDueDate.getTime();

  if (
    task.title === previousTask.title &&
    task.description === previousTask.description &&
    !dueDateChanged
  ) {
    console.log("No changes detected, skipping calendar update");
    return; // nothing changed
  }

  const user = await authRepo.getUser(userId);
  if (!user?.refreshToken) throw new Error("No refresh token found for user");

  oauth2Client.setCredentials({ refresh_token: user.refreshToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const startDateNY = DateTime.fromJSDate(currDueDate!, { zone: "UTC" })
    .setZone("America/New_York");

  const event: Partial<calendar_v3.Schema$Event> = {
    summary: task.title,
    description: task.description ?? "",
    start: { dateTime: startDateNY.toISO(), timeZone: "America/New_York" },
    end: { dateTime: startDateNY.toISO(), timeZone: "America/New_York" },
  };

  await calendar.events.update({
    calendarId: "primary",
    eventId: googleEventId,
    requestBody: event,
  });

  console.log("Google Calendar event updated successfully");
}

/**
 * Delete a Google Calendar event
 */
export async function deleteCalendarEvent(userId: string, eventId: string) {
  const user = await authRepo.getUser(userId);
  if (!user?.refreshToken) throw new Error("No refresh token found for user");

  oauth2Client.setCredentials({ refresh_token: user.refreshToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  await calendar.events.delete({ calendarId: "primary", eventId });
}
