import { Request, Response } from "express";
import { llmService } from "../services/llm";

export async function getProposedCourseInfo(
  request: Request,
  response: Response
) {
  const { doc } = request.body;
  try {
    const proposals = llmService.getCourseAndTasks(doc);
    response.status(200).json(proposals);
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
export async function getTasksList(request: Request, response: Response) {
  const { tasks } = request.body;
  try {
    const tasksList = llmService.getTasksOrdering(tasks);
    response.status(200).json({ tasks: tasksList });
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
