import { Request, Response } from "express";
import { createCalendarEvent, deleteCalendarEvent } from "../utils/googleCalendar";
import { taskRepo } from "../repositories/taskRepository";
import type { Task } from "../../../shared/models/task";
import type {
  NumericFieldValidationResult,
  ValidationResult,
} from "../../../shared/models/validation";
import {
  attemptsToUpdateImmutable,
  setTaskDefaults,
  hasRequiredFields,
  isTaskTypeValid,
  normalizeTaskDates,
  validateNumericTakFieldValues,
} from "../utils/taskUtils";

export async function createUserTask(request: Request, response: Response) {
  const taskPayload = request.body;
  let errorMessage: string;

  try {
    // Ensure taskId is undefined so Firestore generates a new one
    taskPayload.taskId = undefined;

    const normalizedDates: Task = normalizeTaskDates(taskPayload);
    if (!hasRequiredFields(normalizedDates)) {
      errorMessage = "Payload is missing userId, title, or courseId";
      return response.status(400).json({ message: errorMessage });
    }

    const taskValidationResult: ValidationResult = isTaskTypeValid(normalizedDates);
    if (!taskValidationResult.isValid) {
      errorMessage = taskValidationResult.firstError!;
      return response.status(400).json({ message: errorMessage });
    }

    const fieldValidationResult: NumericFieldValidationResult =
      validateNumericTakFieldValues(normalizedDates);
    if (!fieldValidationResult.isValid) {
      errorMessage = fieldValidationResult.firstError!;
      return response.status(400).json({ message: errorMessage });
    }

    // Set defaults and create task
    const validatedTask: Task = setTaskDefaults(normalizedDates);
    const createdTask: Task = await taskRepo.createTask(validatedTask as Task);

    // Create Google Calendar event using taskId as eventId
  if (createdTask.userId) {
    try {
      const calendarEvent = await createCalendarEvent(createdTask.userId, createdTask);
      // store Google event ID in Firestore
      await taskRepo.updateTask(createdTask.userId, createdTask.taskId!, { 
        googleEventId: calendarEvent.id 
      });
      createdTask.googleEventId = calendarEvent.id; // keep it in the response
    } catch (calendarError) {
      console.error("Error creating Google Calendar event:", calendarError);
    }
  }


    return response.status(200).json({
      message: "Successfully created a task",
      task: createdTask,
    });

  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Unknown error: " + JSON.stringify(err);
    console.error(err);
    return response.status(400).json({ message: errorMessage });
  }
}


export async function getUserTasks(request: Request, response: Response) {
  const { userId } = request.params;
  const taskId = (request.query.taskId as string | undefined) ?? null;
  const courseId = (request.query.courseId as string | undefined) ?? null;

  try {
    let tasksRetrieved: Task[];
    if (taskId === null) {
      tasksRetrieved = await taskRepo.getAllUserTasks(userId, courseId);
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
    const normalizedTask: Task = normalizeTaskDates(taskPayload);

    if (attemptsToUpdateImmutable(normalizedTask)) {
      errorMessage = "You cannot update the task id or user id of a task.";
      return response.status(400).json({ message: errorMessage });
    }

    const taskValidationResult: ValidationResult =
      isTaskTypeValid(normalizedTask);
    if (!taskValidationResult.isValid) {
      errorMessage = taskValidationResult.firstError!;
      return response.status(400).json({ message: errorMessage });
    }

    const fieldValidationResult: NumericFieldValidationResult =
      validateNumericTakFieldValues(normalizedTask);
    if (!fieldValidationResult.isValid) {
      errorMessage = fieldValidationResult.firstError!;
      return response.status(400).json({ message: errorMessage });
    }

    await taskRepo.updateTask(userId, taskId, normalizedTask);
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
    const task: Task = await taskRepo.getSingleUserTask(userId, taskId);
    await taskRepo.deleteTask(userId, taskId);
    
    // Delete corresponding Google Calendar event if it exists
    if (task.googleEventId) {
      try {
        await deleteCalendarEvent(userId, task.googleEventId);
      } catch (calendarError) {
        console.error("Error deleting Google Calendar event:", calendarError);
      }
    }

    return response.status(200).json({
      message: `Successfully deleted task ${taskId}`,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error: " + JSON.stringify(err);
    console.error(err);
    return response.status(400).json({ message: errorMessage });
  }
}
