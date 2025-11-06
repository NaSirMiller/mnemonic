import type { Course } from "../../../shared/models/course";
const BASE_URL: string = "http://localhost:5000";

export async function createCourse(coursePayload: Course) {
  const res = await fetch(`${BASE_URL}/api/courses/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(coursePayload),
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
  return data;
}

export async function getCourses(
  userId: string,
  courseId: string | null = null
) {
  const url = `${BASE_URL}/api/courses/${userId}${
    courseId ? `?courseId=${courseId}` : ""
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
  return data;
}

export async function updateCourse(
  userId: string,
  courseId: string,
  coursePayload: Course
) {
  const url = `${BASE_URL}/api/courses/${userId}/${courseId}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(coursePayload),
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
  return data;
}

export async function deleteCourse(userId: string, courseId: string) {
  const url = `${BASE_URL}/api/courses/${userId}/${courseId}`;
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
  return data;
}
