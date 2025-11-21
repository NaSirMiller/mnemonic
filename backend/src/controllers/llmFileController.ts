import { Request, Response } from "express";
// import type multer from "multer";

import {
  convertDocBufferToHtmlString,
  convertHtmlToText,
} from "../utils/fileUtils";

export async function getDocText(
  request: Request & { file?: Express.Multer.File },
  response: Response
) {
  if (!request.file) return response.status(400).send("No file uploaded.");

  const docBuffer: Buffer = request.file.buffer;
  console.log(`Received file - ${request.file.originalname}`);

  // const docText: string = await convertDocBufferToHtmlString(docBuffer);

  const html: string = await convertDocBufferToHtmlString(docBuffer);
  const docText: string = convertHtmlToText(html);

  response.status(200).json({ doc: docText });
}
