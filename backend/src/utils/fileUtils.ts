import pdf2html from "pdf2html";
import { Buffer } from "buffer";

export async function convertDocBufferToHtmlString(
  document: Buffer
): Promise<string> {
  return await pdf2html.html(document);
}

export function stringToBuffer(text: string): Buffer {
  return Buffer.from(text, "utf-8");
}
