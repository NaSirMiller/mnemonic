import { getDocText as getDocTextApi } from "../api/llmFileApi";
import type { Course } from "../../../shared/models/course";
import type { Task } from "../../../shared/models/task";
import {
  getProposedCourseInfo as getProposedCourseInfoApi,
  getTasksList as getTasksListApi,
} from "../api/llmReqApi";

export class SendFileError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, SendFileError.prototype);
  }
}

export class CourseTasksCreationError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, CourseTasksCreationError.prototype);
  }
}

export class TasksListOrderingError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, TasksListOrderingError.prototype);
  }
}
export async function getDocText(file: File): Promise<{ doc: string }> {
  try {
    // Convert ArrayBuffer to Uint8Array if needed

    const result = await getDocTextApi(file);

    if (!result.doc) {
      throw new SendFileError("No HTML returned from server", "no-doc");
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error sending file to LLM API:", error.message);
      throw new SendFileError(
        `Error sending file: ${error.message}`,
        "api-error"
      );
    }
    throw new SendFileError("Unknown error sending file", "unknown");
  }
}

export async function getProposedCourseInfo(
  doc: string
): Promise<{ course: Course; tasks: Task[]; error: string }> {
  try {
    const result = await getProposedCourseInfoApi(doc);

    if (!result.course) {
      throw new CourseTasksCreationError(
        "No courses provided by LLM",
        "no-doc"
      );
    }
    if (!result.tasks) {
      throw new CourseTasksCreationError("No tasks provided by LLM", "no-doc");
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error requesting syllabus extraction:", error.message);
      throw new CourseTasksCreationError(
        `Error sending file: ${error.message}`,
        "api-error"
      );
    }
    throw new CourseTasksCreationError(
      "Unknown error requesting syllabus extraction:",
      "unknown"
    );
  }
}

export async function getTasksList(tasks: Task[]): Promise<{ tasks: Task[] }> {
  try {
    const result = await getTasksListApi(tasks);

    if (!result.tasks) {
      throw new TasksListOrderingError("No tasks provided by LLM", "no-doc");
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error requesting task list ordering:", error.message);
      throw new TasksListOrderingError(
        `Error sending file: ${error.message}`,
        "api-error"
      );
    }
    throw new TasksListOrderingError(
      "Unknown error Error requesting task list ordering:",
      "unknown"
    );
  }
}
