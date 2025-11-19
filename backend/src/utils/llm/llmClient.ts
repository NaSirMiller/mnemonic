import * as dotenv from "dotenv";
import { OpenRouter } from "@openrouter/sdk";
dotenv.config();

export class LLMClient {
  private client: OpenRouter;

  constructor(apiKey = process.env.OPENROUTER_KEY!) {
    this.client = new OpenRouter({ apiKey });
  }
  async chat(
    model: string,
    messages: { role: "system" | "user" | "assistant"; content: string }[]
  ) {
    const res = await this.client.chat.send({
      model,
      messages,
    });

    const choice = res.choices[0];
    const content = choice.message?.content;

    let text: string;

    if (Array.isArray(content)) {
      // Join only the text components
      text = content
        .filter((item) => item.type === "text")
        .map((item) => item.text)
        .join("\n");
    } else {
      text = content ?? "";
    }

    return {
      text,
      raw: res,
    };
  }
}
