import { LLMInstanceConfig } from "../../../../shared/models/llm";
import { LLMClient } from "./llmClient";

export class LLMInstance {
  constructor(private client: LLMClient, private config: LLMInstanceConfig) {}

  async generate(userPrompt: string): Promise<string> {
    const { model, systemPrompt } = this.config;

    const response = await this.client.chat(model, [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    const content = response.text ?? "";
    // console.log("LLM raw response:", content);
    return content;
  }
}
