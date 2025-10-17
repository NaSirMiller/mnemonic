import fetch from "node-fetch";

interface GoogleTokenResponse {
  access_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string; // in case Google returns an error
  error_description?: string;
}

export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
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

    const data = (await response.json()) as GoogleTokenResponse;

    if (!response.ok || !data.access_token) {
      console.error("Failed to refresh Google access token:", data);
      return null;
    }

    return data.access_token;
  } catch (err) {
    console.error("Error refreshing Google access token:", err);
    return null;
  }
}
