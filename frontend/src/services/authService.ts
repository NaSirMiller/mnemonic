import type { FullUser } from "../../../shared/models/user";
import {
  verifyIdToken as verifyIdTokenApi,
  getAccessToGoogleCalendar as getAccessToGoogleCalendarApi,
  refreshAccessToken as refreshAccessTokenApi,
  getUser as getUserApi,
} from "../api";

export class IdTokenVerificationError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, IdTokenVerificationError.prototype);
  }
}

export class GoogleAuthError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, GoogleAuthError.prototype);
  }
}

export class GetUserError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, GetUserError.prototype);
  }
}

export async function isValidIdToken(idToken: string): Promise<boolean> {
  try {
    const verificationResult = await verifyIdTokenApi(idToken);
    if (!verificationResult.validUser) {
      console.log("Id token could not be verified, please try again.");
      return false;
    }
    console.log("User's id token has been verified.");
    return true;
  } catch (error: unknown) {
    // Network / fetch / API errors
    if (error instanceof Error) {
      console.error("Id token verification failed:", error.message);

      throw new IdTokenVerificationError(
        `Error signing in user: ${error.message}`,
        "api-error"
      );
    } else {
      console.error("Unknown login error", error);
      throw new IdTokenVerificationError(
        "Unknown error during login",
        "unknown"
      );
    }
  }
}

export function getGoogleCalendarAccessUrl(userId: string): string {
  try {
    return getAccessToGoogleCalendarApi(userId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to get Google Calendar access URL:", error.message);
      throw new GoogleAuthError(
        `Failed to get Google Calendar URL: ${error.message}`,
        "invalid-userid"
      );
    }
    throw new GoogleAuthError(
      "Unknown error getting Google Calendar URL",
      "unknown"
    );
  }
}

export async function getRefreshedGoogleAccessToken(
  userId: string
): Promise<string> {
  try {
    const accessToken = await refreshAccessTokenApi(userId);
    console.log("Successfully refreshed Google access token");
    return accessToken;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to refresh Google access token:", error.message);
      throw new GoogleAuthError(
        `Failed to refresh access token: ${error.message}`,
        "refresh-failed"
      );
    }
    throw new GoogleAuthError(
      "Unknown error refreshing access token",
      "unknown"
    );
  }
}

export async function getUser(userId: string): Promise<FullUser> {
  console.log(`User id in getUser (service): ${userId}`);
  try {
    const user = await getUserApi(userId);
    console.log("Successfully fetched user:", user.userId);
    return user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch user:", error.message);
      throw new GetUserError(
        `Could not get user: ${error.message}`,
        "api-error"
      );
    }
    console.error("Unknown error fetching user:", error);
    throw new GetUserError("Unknown error fetching user", "unknown");
  }
}
