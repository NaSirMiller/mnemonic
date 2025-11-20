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

const DEFAULT_MODEL_NAME = "deepseek/deepseek-r1-distill-llama-70b:free";
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
    const response: string = await this.llm.generate(requestPrompt);
    const proposals: CourseTasksCreationResponse = JSON.parse(response);
    return proposals;
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
    const tasksListString: string = stringifiedTasks.join("\n"); // TODO: Use in actual prompt.
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
