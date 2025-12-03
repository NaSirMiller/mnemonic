import type { Course } from "../../../shared/models/course";
import type { Task } from "../../../shared/models/task";

const BASE_URL: string = "http://localhost:5000";

export interface CreateCourseWithTasksPayload {
  course: Course;
  tasks: Task[];
}

export async function createCourseWithTasksApi(
  payload: CreateCourseWithTasksPayload
) {
  const res = await fetch(`${BASE_URL}/api/coursesWithTasks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await res.json(); // parse JSON first
  } catch {
    data = null; // body is empty or invalid
  }

  if (!res.ok) {
    // Prefer the message from the server if it exists
    const message =
      data?.message ||
      data?.error ||
      res.statusText ||
      `An error occurred: ${res.status}`;
    throw new Error(message);
  }

  return data; // { course: Course, tasks: Task[] }
}
