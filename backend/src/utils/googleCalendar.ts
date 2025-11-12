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
 * Create a Google Calendar event using the taskId as eventId
 * Returns the event object including `id`
 */
export async function createCalendarEvent(
  userId: string,
  task: Task
): Promise<calendar_v3.Schema$Event> {
  const user = await authRepo.getUser(userId);
  if (!user?.refreshToken) throw new Error("No refresh token found for user");

  oauth2Client.setCredentials({ refresh_token: user.refreshToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const startDate = toValidDate(task.dueDate) || new Date();
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hour

  const event: Omit<calendar_v3.Schema$Event, "id"> = { // don’t provide `id`
    summary: task.title,
    description: task.description ?? "",
    start: { dateTime: startDate.toISOString() },
    end: { dateTime: endDate.toISOString() },
    reminders: { useDefault: true },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });

  return response.data; // includes Google-generated event.id
}


/**
 * Delete a Google Calendar event using the taskId as eventId
 */
export async function deleteCalendarEvent(userId: string, eventId: string) {
  const user = await authRepo.getUser(userId);
  if (!user?.refreshToken) throw new Error("No refresh token found for user");

  oauth2Client.setCredentials({ refresh_token: user.refreshToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  await calendar.events.delete({
    calendarId: "primary",
    eventId, // use taskId / eventId
  });
}
