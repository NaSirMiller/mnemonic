import * as dotenv from "dotenv";
import { OpenRouter } from "@openrouter/sdk";
dotenv.config();

import { LLMResponse, ChatHistory, ChatTurn } from "../../../shared/models/llm";

const DEFAULT_MODEL_NAME = "deepseek/deepseek-r1-distill-llama-70b:free";

export class LLMRepository {
  openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_KEY,
  });

  modelName: string;

  constructor(modelName: string = DEFAULT_MODEL_NAME) {
    this.modelName = modelName;
  }

  async getResponse(query: string): Promise<LLMResponse> {
    return {};
  }
}
