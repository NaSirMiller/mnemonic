import { useState } from "react";

interface SyllabusUploaderProps {
  onSubmit: (file: File) => void;
}

export function SyllabusUploader({ onSubmit }: SyllabusUploaderProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (!file) {
      console.log("No file selected for upload.");
      return;
    }
    console.log("Uploading file:", file);
    onSubmit(file);
  };

  return (
    <div className="syllabus-uploader">
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
  
}
