import { useState } from "react";

interface SyllabusUploaderProps {
  onSubmit: (file: File) => void;
}

export function SyllabusUploader({ onSubmit }: SyllabusUploaderProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (!file) return;
    onSubmit(file);
  };

  return (
    <div className="syllabus-uploader">
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
