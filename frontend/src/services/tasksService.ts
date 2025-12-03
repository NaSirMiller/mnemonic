import {
  createTask as createTaskApi,
  getTasks as getTasksApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
} from "../api";

import type { Task } from "../../../shared/models/task";

export class CreateTaskError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, CreateTaskError.prototype);
  }
}

export class GetTasksError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, GetTasksError.prototype);
  }
}

export class UpdateTaskError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, UpdateTaskError.prototype);
  }
}

export class DeleteTaskError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, DeleteTaskError.prototype);
  }
}

export async function createTask(taskPayload: Task): Promise<Task> {
  console.log("Creating task with payload:", taskPayload);
  try {
    const response = await createTaskApi(taskPayload);

    // If your backend returns { task: { ... } }
    if (response?.task) {
      console.log("Task created:", response.task);
      return response.task;
    }

    // Fallback: assume backend doesn’t return the created task
    console.warn("Backend did not return created task, returning payload instead.");
    return taskPayload;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Task could not be created:", error.message);
      throw new CreateTaskError(
        `Error creating given task: ${error.message}`,
        "api-error"
      );
    } else {
      console.error("Unknown task creation error", error);
      throw new CreateTaskError(
        "Unknown error during task creation",
        "unknown"
      );
    }
  }
}

/**
 * Convert a value to a Date object if possible
 */
function parseDate(value: unknown): Date | null | undefined {
  if (!value) return undefined;

  // Narrow to object first
  if (typeof value === "object" && value !== null) {
    const obj = value as { _seconds?: number; _nanoseconds?: number };

    if (
      typeof obj._seconds === "number" &&
      typeof obj._nanoseconds === "number"
    ) {
      return new Date(obj._seconds * 1000 + obj._nanoseconds / 1000000);
    }
  }

  // Already a JS Date
  if (value instanceof Date) return value;

  // String or number
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }

  return undefined;
}

export async function getTasks(
  userId: string,
  taskId: string | null = null,
  courseId: string | null = null
): Promise<Task[]> {
  try {
    const tasksResponse = await getTasksApi(userId, taskId, courseId);
    const tasks: Task[] = tasksResponse.tasks;

    // Normalize dates for each task
    const normalizedTasks = tasks.map((task) => ({
      ...task,
      dueDate: task.dueDate ? parseDate(task.dueDate) : undefined,
      createdAt: parseDate(task.createdAt),
      lastUpdatedAt: parseDate(task.lastUpdatedAt),
    }));

    console.log(`Retrieved ${normalizedTasks.length} task(s).`);
    return normalizedTasks;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        taskId === null
          ? "Could not get user tasks: "
          : "Could not get specified task",
        error.message
      );

      throw new GetTasksError(
        taskId === null
          ? `Error retrieving tasks: ${error.message}`
          : `Error retrieving given task: ${error.message}`,
        "api-error"
      );
    } else {
      console.error("Unknown task retrieval error", error);
      throw new GetTasksError("Unknown error during task retrieval", "unknown");
    }
  }
}

export async function updateTask(
  userId: string,
  taskId: string,
  taskPayload: Task
): Promise<void> {
  try {
    await updateTaskApi(userId, taskId, taskPayload);
    console.log("Task updated.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Task could not be updated: ", error.message);

      throw new UpdateTaskError(
        `Error updating given task: ${error.message}`,
        "api-error"
      );
    } else {
      console.error("Unknown task update error", error);
      throw new UpdateTaskError("Unknown error during task update", "unknown");
    }
  }
}

export async function deleteTask(
  userId: string,
  taskId: string
): Promise<void> {
  try {
    await deleteTaskApi(userId, taskId);
    console.log("Task deleted.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Task could not be deleted: ", error.message);

      throw new DeleteTaskError(
        `Error deleting given task: ${error.message}`,
        "api-error"
      );
    } else {
      console.error("Unknown task deletion error", error);
      throw new DeleteTaskError(
        "Unknown error during task deletion",
        "unknown"
      );
    }
  }
}
