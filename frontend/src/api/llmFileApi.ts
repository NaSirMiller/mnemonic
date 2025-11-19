import FormData from "form-data";

const BASE_URL: string = "http://localhost:5000";

export async function sendFileAsHtml(doc: Buffer, filename: string) {
  const formData = new FormData();
  formData.append("file", doc, filename);

  const res = await fetch(`${BASE_URL}/api/files/`, {
    method: "POST",
    body: formData as unknown as BodyInit,
    headers: formData.getHeaders(),
  });

  return res.json();
}
