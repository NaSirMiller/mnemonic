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

export async function createTask(taskPayload: Task): Promise<void> {
  try {
    await createTaskApi(taskPayload);
    console.log("Task created.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Task could not be created: ", error.message);

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

export async function getTasks(
  userId: string,
  taskId: string | null = null
): Promise<Task[]> {
  try {
    const tasksResponse = await getTasksApi(userId, taskId);
    const tasks: Task[] = tasksResponse.tasks;
    console.log(`Retrieved ${tasks.length} task.`);
    return tasks;
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
