import {
  createCourseWithTasksApi,
  type CreateCourseWithTasksPayload,
} from "../api/coursesWithTasksApi";
import type { Course } from "../../../shared/models/course";
import type { Task } from "../../../shared/models/task";

export class CreateCourseWithTasksError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, CreateCourseWithTasksError.prototype);
  }
}

export async function createCourseWithTasks(
  course: Course,
  tasks: Task[]
): Promise<{ course: Course; tasks: Task[] }> {
  const payload: CreateCourseWithTasksPayload = { course, tasks };

  try {
    const result = await createCourseWithTasksApi(payload);
    console.log("Course with tasks created successfully.");
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to create course with tasks:", error.message);
      throw new CreateCourseWithTasksError(
        `Error creating course with tasks: ${error.message}`,
        "api-error"
      );
    } else {
      console.error("Unknown error creating course with tasks", error);
      throw new CreateCourseWithTasksError(
        "Unknown error during course with tasks creation",
        "unknown"
      );
    }
  }
}
