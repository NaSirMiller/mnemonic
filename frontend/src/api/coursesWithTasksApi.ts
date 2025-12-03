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

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      throw new Error(`An error occurred: ${res.status}`);
    }
    throw new Error(errorData.error || `An error occurred: ${res.status}`);
  }

  const data = await res.json();
  return data; // { course: Course, tasks: Task[] }
}
