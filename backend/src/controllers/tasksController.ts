import { Request, Response } from "express";
import { firebaseRepo } from "../repositories/firebaseRepository";
import { Task } from "../models/task";

export async function createUserTask(request: Request, response: Response) {
  const taskPayload = request.body;
  try {
    const createdTask: Task = await firebaseRepo.createTask(
      taskPayload as Task
    );
    return response.status(200).json({
      message: "Successfully created a task.",
      task: createdTask,
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

export async function getUserTasks(request: Request, response: Response) {
  const { userId } = request.params;
  const taskId: string | undefined = request.query.taskId as string | undefined;

  try {
    let tasksRetrieved: Task[];
    if (taskId === undefined) {
      tasksRetrieved = await firebaseRepo.getAllUserTasks(userId);
    } else {
      const task: Task = await firebaseRepo.getSingleUserTask(userId, taskId);
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
  try {
    await firebaseRepo.updateTask(userId, taskId, taskPayload as Task);
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
    await firebaseRepo.deleteTask(userId, taskId);
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
