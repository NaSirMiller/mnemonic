import React, { useState } from "react";

import "./FileInput.css";

interface FileInputProps {
  onUpload?: (file: File) => Promise<void>;
}

// Adjusted from https://www.geeksforgeeks.org/reactjs/file-uploading-in-react-js/#
export function FileInput({ onUpload }: FileInputProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File selected:", event.target.files?.[0]);
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !onUpload) return;
    await onUpload(selectedFile);
    setSelectedFile(null); // reset after upload
  };

  return (
    <div className="file-input-container">
      <label className="file-input-label">
        {selectedFile ? selectedFile.name : "Choose a file"}
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input-field"
        />
      </label>

      <button
        onClick={handleUpload}
        disabled={!selectedFile}
        className="file-input-button"
      >
        Upload
      </button>
    </div>
  );
}
