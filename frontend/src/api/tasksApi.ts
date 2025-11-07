import type { Task } from "../../../shared/models/task";
const BASE_URL: string = "http://localhost:5000";

export async function createTask(taskPayload: Task) {
  const res = await fetch(`${BASE_URL}/api/tasks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskPayload }),
  });

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      throw new Error(`An error occurred: ${res.status}`);
    }
    throw new Error(errorData.error || `An error occurred: ${res.status}`);
  }

  const data = await res.json();
  return data; // Response format: {message: string, task: Task}
}

export async function getTasks(
  userId: string,
  taskId: string | null,
  courseId: string | null
) {
  const params = new URLSearchParams();
  if (taskId) params.append("taskId", taskId);
  if (courseId) params.append("courseId", courseId);

  const url = `${BASE_URL}/api/tasks/${userId}${
    params.toString() ? `?${params.toString()}` : ""
  }`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      throw new Error(`An error occurred: ${res.status}`);
    }
    throw new Error(errorData.error || `An error occurred: ${res.status}`);
  }

  const data = await res.json();
  return data; // Response format: {message: string, tasks: Task[]}
}

export async function updateTask(
  userId: string,
  taskId: string,
  taskPayload: Task
) {
  const url = `${BASE_URL}/api/tasks/${userId}/${taskId}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskPayload),
  });

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      throw new Error(`An error occurred: ${res.status}`);
    }
    throw new Error(errorData.error || `An error occurred: ${res.status}`);
  }

  const data = await res.json();
  return data; // Response format: {message: string}
}

export async function deleteTask(userId: string, taskId: string) {
  const url = `${BASE_URL}/api/tasks/${userId}/${taskId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      throw new Error(`An error occurred: ${res.status}`);
    }
    throw new Error(errorData.error || `An error occurred: ${res.status}`);
  }

  const data = await res.json();
  return data; // Response format: {message: string}
}
