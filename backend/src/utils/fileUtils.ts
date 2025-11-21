import pdf2html from "pdf2html";
import { Buffer } from "buffer";
import { htmlToText } from "html-to-text";

export async function convertDocBufferToHtmlString(
  document: Buffer
): Promise<string> {
  return await pdf2html.html(document);
}

export function convertHtmlToText(html: string): string {
  return htmlToText(html);
}

export function stringToBuffer(text: string): Buffer {
  return Buffer.from(text, "utf-8");
}
