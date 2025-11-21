import { LLMClient } from "../utils/llm/llmClient";
import { LLMInstance } from "../utils/llm/llmInstance";
import { LLMInstanceConfig } from "../../../shared/models/llm";
import {
  creationSystemPrompt,
  getCreationRequestPrompt,
} from "../utils/llm/prompts";
import { taskToString } from "../utils/taskUtils";

import { Task } from "../../../shared/models/task";
import { CourseTasksCreationResponse } from "../../../shared/models/response";

const DEFAULT_MODEL_NAME = "openai/gpt-4o-mini";
const client = new LLMClient();

const courseTasksConfig: LLMInstanceConfig = {
  name: "Course Task Generator",
  model: DEFAULT_MODEL_NAME,
  systemPrompt: creationSystemPrompt,
};

const courseTaskCreator = new LLMInstance(client, courseTasksConfig);

export class CourseTasksCreationError extends Error {
  public code: string;

  constructor(message: string, code: string) {
    super(message); // Call the base Error constructor
    this.name = "CourseTasksCreationError";
    this.code = code;

    // Maintains proper stack trace (only in V8 engines like Node/Chrome)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CourseTasksCreationError);
    }
  }
}

class LLMService {
  constructor(private llm = courseTaskCreator) {}
  async getCourseAndTasks(
    docText: string
  ): Promise<CourseTasksCreationResponse> {
    const requestPrompt: string = getCreationRequestPrompt(docText);
    // console.log(`Model used: ${this.llm.getModel()}`);

    const maxNumAttempts = 3;
    let attempt = 0;
    let response = "";

    while (attempt < maxNumAttempts) {
      try {
        response = await this.llm.generate(requestPrompt);

        // Log raw LLM response
        // console.log(`Attempt #${attempt + 1} response:`, response);

        // Parse JSON
        const proposals: CourseTasksCreationResponse = JSON.parse(response);

        // Validate required fields
        if (!proposals.course || !proposals.tasks) {
          throw new Error("Incomplete LLM response: missing course or tasks");
        }

        // Return valid response
        return proposals;
      } catch (error: unknown) {
        console.error(
          `Attempt #${attempt + 1} failed:`,
          error instanceof Error ? error.message : error
        );
        console.error("Raw response was:", JSON.stringify(response));

        attempt += 1;
        if (attempt < maxNumAttempts) {
          console.log("Retrying...");
          await new Promise((res) => setTimeout(res, 1000)); // Slightly longer wait
        }
      }
    }

    // Throw instead of returning empty object
    throw new CourseTasksCreationError(
      `LLM failed to generate a valid CourseTasksCreationResponse after ${maxNumAttempts} attempts.`,
      "llm-error"
    );
  }

  async getTasksOrdering(tasks: Task[]): Promise<Task[]> {
    const tasksMap: Record<number, Task> = {};
    const stringifiedTasks: string[] = [];
    let task: Task;
    for (let i = 0; i < tasks.length; i++) {
      // Assign each task a non invasive id based on its positioning in the original order.
      task = tasks[i];
      tasksMap[i] = task;
      stringifiedTasks.push(`id=${i}:${taskToString(task)}`); // Convert task to string representation with id assigned.
    }
    // const tasksListString: string = stringifiedTasks.join("\n"); // TODO: Use in actual prompt.
    const response: string = await this.llm.generate(""); // TODO: Add actual prompt.
    const taskIdOrdering: number[] = JSON.parse(response);
    const orderedTasks: Task[] = [];
    for (const taskId of taskIdOrdering) {
      orderedTasks.push(tasksMap[taskId]);
    }
    return orderedTasks;
  }
}
export const llmService = new LLMService();
