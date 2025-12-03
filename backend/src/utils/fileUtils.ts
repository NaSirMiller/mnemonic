import pdf2html from "pdf2html";
import { Buffer } from "buffer";
import { convert } from "html-to-text";

export async function convertDocBufferToHtmlString(
  document: Buffer
): Promise<string> {
  return await pdf2html.html(document);
}

export function stringToBuffer(text: string): Buffer {
  return Buffer.from(text, "utf-8");
}

export function convertHtmlToText(html: string): string {
  return convert(html, {
    wordwrap: 130, // optional: wrap lines at 130 chars
    selectors: [
      { selector: "a", options: { ignoreHref: false } }, // ignore links if you want
    ],
  });
}
