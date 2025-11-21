import type { Task } from "../../../shared/models/task";

const BASE_URL: string = "http://localhost:5000";

export async function getProposedCourseInfo(docText: string) {
  console.log(`docText in API layer: ${docText}`);
  const url: string = `${BASE_URL}/api/llmReq/courses`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ doc: docText }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error || `Failed to fetch syllabus response: ${res.status}`
    );
  }

  const data = await res.json();
  console.log(`Data api: ${JSON.stringify(data)}`);
  return data;
}

export async function getTasksList(tasks: Task[]) {
  const url: string = `${BASE_URL}/api/llmReq/tasksList`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tasks: tasks }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error || `Failed to fetch ordering response: ${res.status}`
    );
  }

  const data = await res.json();
  return data;
}
