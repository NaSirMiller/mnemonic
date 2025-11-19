import { LLMClient } from "../utils/llm/llmClient";
import { LLMInstance } from "../utils/llm/llmInstance";
import { LLMInstanceConfig } from "../../../shared/models/llm";
import {
  creationSystemPrompt,
  creationExamplePrompt,
  getCreationRequestPrompt,
} from "../utils/llm/prompts";

import { LLMResponse } from "../../../shared/models/llm";
import { CourseTasksCreationResponse } from "../../../shared/models/response";

const DEFAULT_MODEL_NAME = "deepseek/deepseek-r1-distill-llama-70b:free";
const client = new LLMClient();

const courseTasksConfig: LLMInstanceConfig = {
  name: "Course Task Generator",
  model: DEFAULT_MODEL_NAME,
  systemPrompt: creationSystemPrompt,
};

const courseTaskCreator = new LLMInstance(client, courseTasksConfig);

export class CourseTaskCreationService {
  constructor(private llm = courseTaskCreator) {}
  async getCourseAndTasks(
    docText: string
  ): Promise<CourseTasksCreationResponse> {
    return { tasks: [], courses: [] }; //TODO: Update with result from llm
  }
}
