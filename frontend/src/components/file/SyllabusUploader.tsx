import { getDocText } from "../../services/llmService";
import { FileInput } from "./FileInput";

interface SyllabusUploaderProps {
  onUpload: (fileHtml: string) => void;
}

export function SyllabusUploader({ onUpload }: SyllabusUploaderProps) {
  const uploadFile = async (file: File) => {
    const response = await getDocText(file);
    const docText: string = response.doc;
    onUpload(docText);
    console.log(`PDF to string: ${docText}`);
  };

  return <FileInput onUpload={uploadFile} />;
}
