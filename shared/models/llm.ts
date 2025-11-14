export interface LLMResponse {
  model: string;
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  id?: string;
}

export interface ChatTurn {
  id?: string;
  timestamp: Date;
  prompt: string;
  response: LLMResponse;
}

export interface ChatHistory {
  id?: string;
  turns: ChatTurn[];
  createdAt?: Date;
}

export interface LLMInstanceConfig {
  name: string;
  model: string;
  systemPrompt: string;
}
