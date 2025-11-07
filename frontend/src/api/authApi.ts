const BASE_URL: string = "http://localhost:5000";

export async function verifyIdToken(idToken: string) {
  const res = await fetch(`${BASE_URL}/api/auth/verifyIdToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `An error ocurred: ${res.status}`);
  }

  const data = await res.json();
  return data; // Response format : { validUser: boolean }
}

export function getAccessToGoogleCalendar(userId: string) {
  if (!userId) throw new Error("userId is required");

  // Construct the URL for backend OAuth redirect
  const url = `${BASE_URL}/api/auth/google/connect?userId=${userId}`;

  // Return the URL so the frontend can navigate
  return url;
}

export async function refreshAccessToken(userId: string) {
  if (!userId) throw new Error("userId is required");

  const res = await fetch(`${BASE_URL}/api/auth/refreshAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `An error occurred: ${res.status}`);
  }

  const data = await res.json();
  return data.accessToken as string;
}

export async function getUser(userId: string) {
  if (!userId) throw new Error("userId is required");

  const res = await fetch(`${BASE_URL}/api/auth/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Failed to fetch user: ${res.status}`);
  }

  const data = await res.json();
  return data; // FullUser object
}
