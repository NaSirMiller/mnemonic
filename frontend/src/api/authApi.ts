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
