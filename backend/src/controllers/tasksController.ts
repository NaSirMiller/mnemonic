import { Request, Response } from "express";

import { firebaseRepo } from "../repositories/firebaseRepository";
import { Task } from "../models/task";

export async function createUserTask(request: Request, response: Response) {
  const taskPayload = request.body;
  let createdTask: Task;
  try {
    createdTask = await firebaseRepo.createTask(taskPayload as Task);
  } catch (err) {
    let errorMessage: string;
    if (err instanceof Error) {
      errorMessage = err.message;
      console.error();
    } else {
      (errorMessage = "Unknown error:"), err;
    }
    console.log(errorMessage);
    return response.json({ message: errorMessage }).status(400);
  }
  return response
    .json({
      message: "Successfully created a task.",
      task: createdTask,
    })
    .status(200);
}
export async function getUserTasks(request: Request, response: Response) {
  const { userId } = request.params;
  const taskId: string | undefined = request.query.taskId as string | undefined;
  let tasksRetrieved: Task[];
  try {
    if (taskId === undefined) {
      tasksRetrieved = await firebaseRepo.getAllUserTasks(userId);
    } else {
      let task: Task = await firebaseRepo.getSingleUserTask(userId, taskId);
      tasksRetrieved = [task];
    }
  } catch (err) {
    let errorMessage: string;
    if (err instanceof Error) {
      errorMessage = err.message;
      console.error();
    } else {
      (errorMessage = "Unknown error:"), err;
    }
    console.log(errorMessage);
    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("Unauthorized")
    ) {
      // Invalid task or user id
      return response.json({ message: errorMessage }).status(404);
    }
    // Other error ocurred in process
    return response.json({ message: errorMessage }).status(400);
  }
  return response.json({
    message: "Successfully retrieved tasks",
    tasks: tasksRetrieved,
  });
}
export async function updateUserTask(request: Request, response: Response) {
  const { userId, taskId, taskPayload } = request.body;
  try {
    await firebaseRepo.updateTask(userId, taskId, taskPayload as Task);
  } catch (err) {
    let errorMessage: string;
    if (err instanceof Error) {
      errorMessage = err.message;
      console.error();
    } else {
      (errorMessage = "Unknown error:"), err;
    }
    console.log(errorMessage);
    return response.json({ message: errorMessage }).status(400);
  }
  return response
    .json({
      message: `Successfully updated task ${taskId}.`,
    })
    .status(200);
}
export async function deleteUserTask(request: Request, response: Response) {
  const { userId, taskId } = request.params;
  try {
    firebaseRepo.deleteTask(userId, taskId);
  } catch (err) {
    let errorMessage: string;
    if (err instanceof Error) {
      errorMessage = err.message;
      console.error();
    } else {
      (errorMessage = "Unknown error:"), err;
    }
    console.log(errorMessage);
    return response.json({ message: errorMessage }).status(400);
  }
  return response
    .json({ message: `Successfully deleted task ${taskId}` })
    .status(200);
}
