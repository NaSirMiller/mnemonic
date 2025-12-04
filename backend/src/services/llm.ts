import { LLMClient } from "../utils/llm/llmClient";
import { LLMInstance } from "../utils/llm/llmInstance";
import { LLMInstanceConfig } from "../../../shared/models/llm";
import { courseRepo } from "../repositories/courseRepository";
import {
  creationSystemPrompt,
  getCreationRequestPrompt,
  createTasklistOrderingSystemPrompt,
  createTasklistOrderingRequestPrompt,
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

const tasklistConfig: LLMInstanceConfig = {
  name: "Tasklist Orderer",
  model: DEFAULT_MODEL_NAME,
  systemPrompt: createTasklistOrderingSystemPrompt(),
};

const taskListOrderer = new LLMInstance(client, tasklistConfig);

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
  constructor(private llm: LLMInstance) {} // removed default

  async getCourseAndTasks(
    docText: string
  ): Promise<CourseTasksCreationResponse> {
    const requestPrompt: string = getCreationRequestPrompt(docText);

    const maxNumAttempts = 3;
    let attempt = 0;
    let response = "";

    while (attempt < maxNumAttempts) {
      try {
        response = await this.llm.generate(requestPrompt);
        const proposals: CourseTasksCreationResponse = JSON.parse(response);

        if (!proposals.course || !proposals.tasks) {
          throw new Error("Incomplete LLM response: missing course or tasks");
        }

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
          await new Promise((res) => setTimeout(res, 1000));
        }
      }
    }

    throw new CourseTasksCreationError(
      `LLM failed to generate a valid CourseTasksCreationResponse after ${maxNumAttempts} attempts.`,
      "llm-error"
    );
  }

  async getTasksOrdering(tasks: Task[]): Promise<Task[]> {
    if (tasks.length === 0) return [];

    const tasksMap: Record<number, Task> = {};
    const stringifiedTasks: string[] = [];
    const uniqueCourseIds = [...new Set(tasks.map((t) => t.courseId!))];
    const userId = tasks[0].userId!;
    const courses = await courseRepo.getAllCourses(userId, uniqueCourseIds);

    const courseMap = new Map(
      courses.map((course) => [course.courseId!, course.courseName!])
    );

    tasks.forEach((task, i) => {
      console.log(`task=${JSON.stringify(task, null, 2)}`);
      console.log(
        `task.dueDate type: ${
          task.dueDate instanceof Date ? "Date" : typeof task.dueDate
        }, value: ${task.dueDate}`
      );
      const courseName = courseMap.get(task.courseId!)!;
      tasksMap[i] = task;
      stringifiedTasks.push(`id=${i}:${taskToString(task, courseName)}`);
    });

    // Build the task list ordering prompt
    const tasksListString = stringifiedTasks.join("\n");

    const response: string = await this.llm.generate(
      createTasklistOrderingRequestPrompt(tasksListString)
    );

    const taskIdOrdering: number[] = JSON.parse(response);
    return taskIdOrdering.map((taskId) => tasksMap[taskId]);
  }
}

export const courseCreationLLMService = new LLMService(courseTaskCreator);
export const tasksListLLMService = new LLMService(taskListOrderer);
