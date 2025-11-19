import { sendFileAsHtml as sendFileAsHtmlApi } from "../api/llmFileApi";

export class SendFileError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, SendFileError.prototype);
  }
}

export async function sendFileAsHtml(
  doc: Buffer,
  filename: string
): Promise<{ doc: string }> {
  try {
    const result = await sendFileAsHtmlApi(doc, filename);

    if (!result.doc) {
      throw new SendFileError("No HTML returned from server", "no-doc");
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error sending file to LLM API:", error.message);
      throw new SendFileError(
        `Error sending file: ${error.message}`,
        "api-error"
      );
    }
    throw new SendFileError("Unknown error sending file", "unknown");
  }
}
