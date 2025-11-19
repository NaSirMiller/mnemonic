import { useState, useEffect, useContext } from "react";

const [currentSyllabus, setSyllabus] = useState<string | null>(null);

const uploadFile = async (file: File) => {
  const fileContent: ArrayBuffer = await file.arrayBuffer();
  const fileName: string = file.name;
  const syllabusHtml: string = await sendFileAsHtml(fileContent, fileName);
  setSyllabus(syllabusHtml);
};
