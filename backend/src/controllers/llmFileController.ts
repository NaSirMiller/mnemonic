import { Request, Response } from "express";
// import type multer from "multer";

import { convertDocBufferToHtmlString } from "../utils/fileUtils";

export async function sendFileAsHtml(
  request: Request & { file?: Express.Multer.File },
  response: Response
) {
  if (!request.file) return response.status(400).send("No file uploaded.");

  const docBuffer: Buffer = request.file.buffer;
  console.log(`Received file - ${request.file.originalname}`);

  const htmlString: string = await convertDocBufferToHtmlString(docBuffer);

  response.status(200).json({ doc: htmlString });
}
