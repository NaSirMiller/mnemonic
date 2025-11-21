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

class LLMService {
  constructor(private llm = courseTaskCreator) {}
  async getCourseAndTasks(
    docText: string
  ): Promise<CourseTasksCreationResponse> {
    const requestPrompt: string = getCreationRequestPrompt(docText);
    let attempt: number = 0;
    let maxNumAttempts: number = 5;
    while (attempt < maxNumAttempts) {
      const response: string = await this.llm.generate(requestPrompt);
      try {
        const proposals: CourseTasksCreationResponse = JSON.parse(response);
        return proposals;
      } catch (error) {
        console.error(`Error ocurred: ${error}`);
        if (attempt < maxNumAttempts) console.error("Trying again...");

        attempt += 1;
      }
    }
    return {
      course: { gradeTypes: {}, courseName: "" },
      tasks: [],
      error: "Could not extract data from document. Please try another method.",
    };
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
