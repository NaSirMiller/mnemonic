import FormData from "form-data";

const BASE_URL: string = "http://localhost:5000";

export async function getDocText(file: File) {
  const formData = new FormData();

  const filename = file.name;
  formData.append("file", file, filename);

  const res = await fetch(`${BASE_URL}/api/files/`, {
    method: "POST",
    body: formData as unknown as BodyInit,
  });

  return res.json();
}
