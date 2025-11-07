import { UserRecord } from "firebase-admin/auth";

export function toFullUser(user: UserRecord, refreshToken?: string | null) {
  return {
    userId: user.uid,
    email: user.email ?? "",
    displayName: user.displayName ?? "",
    photoUrl: user.photoURL ?? null,
    refreshToken: refreshToken ?? null,
    // emailVerified: user.emailVerified,
    // phoneNumber: user.phoneNumber ?? null,
    // creationTime: user.metadata.creationTime,
    // lastSignInTime: user.metadata.lastSignInTime,
    // customClaims: user.customClaims ?? {},
  };
}
