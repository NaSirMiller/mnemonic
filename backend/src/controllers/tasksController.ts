import { Request, Response } from "express";

import { taskRepo } from "../repositories/taskRepository";
import type {
  NumericFieldValidationResult,
  Task,
  ValidationResult,
} from "../../../shared/models/task";
import {
  attemptsToUpdateImmutable,
  setTaskDefaults,
  hasRequiredFields,
  isTaskTypeValid,
  normalizeTaskDates,
  validateNumericTakFieldValues,
} from "../utils/task_utils";

export async function createUserTask(request: Request, response: Response) {
  const taskPayload = request.body;
  let errorMessage: string;
  try {
    if (taskPayload.taskId !== undefined && taskPayload.taskId !== null)
      // Override task id in the payload with firebase created id (later)
      taskPayload.taskId = null;
    if (!hasRequiredFields(taskPayload)) {
      errorMessage =
        "Provided payload is missing one of userId, title, or courseId";
      return response.status(400).json({ message: errorMessage });
    }

    const taskValidationResult: ValidationResult = isTaskTypeValid(taskPayload);
    if (!taskValidationResult.isValid) {
      errorMessage = taskValidationResult.firstError!;
      return response.status(400).json({ message: errorMessage });
    }

    const fieldValidationResult: NumericFieldValidationResult =
      validateNumericTakFieldValues(taskPayload);
    if (!fieldValidationResult.isValid) {
      errorMessage = fieldValidationResult.firstError!;
      return response.status(400).json({ message: errorMessage });
    }

    const taskWithDates: Task = normalizeTaskDates(taskPayload); //Update date fields to date objects -- iff they are not date objects already
    const validatedTask: Task = setTaskDefaults(taskWithDates); // Set fields not provided to default values, rather than nulls

    const createdTask: Task = await taskRepo.createTask(validatedTask as Task);

    return response.status(200).json({
      message: "Successfully created a task.",
      task: createdTask, // Includes created task id.
    });
  } catch (err) {
    if (err instanceof Error) {
      errorMessage = err.message;
      console.error(err);
    } else {
      errorMessage = "Unknown error: " + JSON.stringify(err);
      console.error(err);
    }
    return response.status(400).json({ message: errorMessage });
  }
}

export async function getUserTasks(request: Request, response: Response) {
  const { userId } = request.params;
  const taskId: string | undefined = request.query.taskId as string | undefined;

  try {
    let tasksRetrieved: Task[];
    if (taskId === undefined) {
      tasksRetrieved = await taskRepo.getAllUserTasks(userId);
    } else {
      const task: Task = await taskRepo.getSingleUserTask(userId, taskId);
      tasksRetrieved = [task];
    }
    return response.status(200).json({
      message: "Successfully retrieved tasks",
      tasks: tasksRetrieved,
    });
  } catch (err) {
    let errorMessage: string;
    if (err instanceof Error) {
      errorMessage = err.message;
      console.error(err);
    } else {
      errorMessage = "Unknown error: " + JSON.stringify(err);
      console.error(err);
    }
    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("Unauthorized")
    ) {
      return response.status(404).json({ message: errorMessage });
    }
    return response.status(400).json({ message: errorMessage });
  }
}

export async function updateUserTask(request: Request, response: Response) {
  const { userId, taskId, taskPayload } = request.body;
  let errorMessage: string;
  try {
    if (attemptsToUpdateImmutable(taskPayload)) {
      errorMessage = "You cannot update the task id or user id of a task.";
      return response.status(400).json({ message: errorMessage });
    }

    const taskValidationResult: ValidationResult = isTaskTypeValid(taskPayload);
    if (!taskValidationResult.isValid) {
      errorMessage = taskValidationResult.firstError!;
      return response.status(400).json({ message: errorMessage });
    }

    const fieldValidationResult: NumericFieldValidationResult =
      validateNumericTakFieldValues(taskPayload);
    if (!fieldValidationResult.isValid) {
      errorMessage = fieldValidationResult.firstError!;
      return response.status(400).json({ message: errorMessage });
    }

    await taskRepo.updateTask(userId, taskId, taskPayload as Task);
    return response.status(200).json({
      message: `Successfully updated task ${taskId}.`,
    });
  } catch (err) {
    let errorMessage: string;
    if (err instanceof Error) {
      errorMessage = err.message;
      console.error(err);
    } else {
      errorMessage = "Unknown error: " + JSON.stringify(err);
      console.error(err);
    }
    return response.status(400).json({ message: errorMessage });
  }
}

export async function deleteUserTask(request: Request, response: Response) {
  const { userId, taskId } = request.params;
  try {
    await taskRepo.deleteTask(userId, taskId);
    return response.status(200).json({
      message: `Successfully deleted task ${taskId}`,
    });
  } catch (err) {
    let errorMessage: string;
    if (err instanceof Error) {
      errorMessage = err.message;
      console.error(err);
    } else {
      errorMessage = "Unknown error: " + JSON.stringify(err);
      console.error(err);
    }
    return response.status(400).json({ message: errorMessage });
  }
}
