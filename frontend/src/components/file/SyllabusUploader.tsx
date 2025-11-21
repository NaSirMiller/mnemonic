import { useState } from "react";
import { sendFileAsHtml } from "../../services/llmService";
import { FileInput } from "./FileInput";

export function SyllabusUploader() {
  const [, setSyllabus] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    // const fileContent: Buffer = Buffer.from(await file.arrayBuffer());
    // const fileName: string = file.name;

    const response = await sendFileAsHtml(file);
    const syllabusHtml: string = response.doc;
    setSyllabus(syllabusHtml);
    console.log(syllabusHtml);
  };

  return <FileInput onUpload={uploadFile} />;
}
