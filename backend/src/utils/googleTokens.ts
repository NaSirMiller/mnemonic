import fetch from "node-fetch";

// This function uses a user's Google Refresh Token to gain a new access token for the APIs
export async function refreshAccessToken(refreshToken: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Google access token");
  }

  const data = await response.json() as { access_token: string; expires_in: number; scope: string; token_type: string };
  return data.access_token;
}
