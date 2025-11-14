import { LLMClient } from "../llm/llmClient";
import { LLMInstance } from "../llm/llmInstance";
import { LLMInstanceConfig } from "../../../shared/models/llm";

const DEFAULT_MODEL_NAME = "deepseek/deepseek-r1-distill-llama-70b:free";
const client = new LLMClient();

const taskConfig: LLMInstanceConfig = {
  name: "Task Generator",
  model: DEFAULT_MODEL_NAME,
  systemPrompt: "",
};
const courseConfig: LLMInstanceConfig = {
  name: "Course Generator",
  model: DEFAULT_MODEL_NAME,
  systemPrompt: "",
};

const taskGenerator = new LLMInstance(client, taskConfig);
const courseGenerator = new LLMInstance(client, courseConfig);

export class TaskService {
  constructor(private llm = taskGenerator) {}

  async generateTasks(goal: string) {
    const prompt = `User goal: ${goal}\n\nGenerate 5 concrete tasks.`;
    const text = await this.llm.generate(prompt);
    return text;
  }
}

export class CourseService {
  constructor(private llm = courseGenerator) {}

  async generateCourse(topic: string) {
    const prompt = `Design a beginner-friendly course on: ${topic}`;
    const text = await this.llm.generate(prompt);
    return text;
  }
}
