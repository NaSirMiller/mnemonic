import { verifyIdToken as verifyIdTokenApi } from "../api";

export class IdTokenVerificationError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, IdTokenVerificationError.prototype);
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
