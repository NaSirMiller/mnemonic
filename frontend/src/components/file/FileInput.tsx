import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

// Adjusted from https://www.geeksforgeeks.org/reactjs/file-uploading-in-react-js/#
export function FileInput() {
  const { uid } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };
  const onFileUpload = () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    const formData = new FormData();
    console.log(`File upload started for ${uid}.`);
    formData.append(`${uid}_file`, selectedFile, selectedFile.name);
    // axios.post("api/uploadfile", formData); // fetch method from frontend/service
  };

  return (
    <div>
      <div>
        <input type="file" onChange={onFileChange} />
        <button onClick={onFileUpload}>Submit File</button>
      </div>
    </div>
  );
}
