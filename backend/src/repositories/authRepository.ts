import admin from "../firebase_admin";
import {
  User,
  FullUser,
  MinimalUserModel,
  UserUpdate,
} from "../../../shared/models/user";
import { toFullUser } from "../utils/userUtils";
import { google } from "googleapis";

export class AuthRepository {
  private db = admin.firestore();
  private authDb = admin.auth();

  /**
   * @param idToken Provided id token based on user's Google auth request
   * @returns true iff the token could be verified by Firebase
   */
  async isValidIdToken(idToken: string): Promise<boolean> {
    try {
      await this.authDb.verifyIdToken(idToken, true);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async createUser(user: User): Promise<User> {
    let validatedUser: MinimalUserModel;
    try {
      validatedUser = new MinimalUserModel(user);
    } catch (err) {
      console.error(err);
      throw err;
    }

    const docRef = this.db.collection("users").doc(validatedUser.userId);
    await docRef.set(validatedUser.toJson());

    const newDoc = await docRef.get();
    const firestoreDocData = newDoc.data() as User;

    // Ensure all required fields are present for MinimalUserModel
    const newUser = MinimalUserModel.fromJson({
      userId: newDoc.id,
      refreshToken: firestoreDocData?.refreshToken ?? null,
    });

    return newUser.toJson();
  }

  async getUser(userId: string): Promise<FullUser> {
    const doc = await this.db.collection("users").doc(userId).get();
    if (!doc.exists) {
      throw new Error("User not found");
    }
    const userRecord = await this.authDb.getUser(userId);
    const minimalUserData = doc.data() as { refreshToken?: string | null }; // Get refresh token, if there is one

    return toFullUser(userRecord, minimalUserData.refreshToken ?? null);
  }

  async updateUser(userId: string, data: UserUpdate): Promise<void> {
    const userRef = this.db.collection("users").doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      // Create new user if not exists
      await userRef.set(data);
      return;
    }

    await userRef.update(data);
  }

  async deleteUser(userId: string): Promise<void> {
    const userRef = this.db.collection("users").doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      throw new Error("User not found");
    }

    await userRef.delete();
  }

  async refreshAccessToken(userId: string): Promise<string> {
    const userDoc = await this.db.collection("users").doc(userId).get();
    if (!userDoc.exists) throw new Error("User not found");

    const data = userDoc.data() ?? {};

    // Explicitly set userId and provide default null for refreshToken
    const userData = MinimalUserModel.fromJson({
      userId: userDoc.id,
      refreshToken: data.refreshToken ?? null,
    });

    const previousRefreshToken = userData.refreshToken;
    if (!previousRefreshToken)
      throw new Error("No refresh token stored for user");

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: previousRefreshToken });

    const { credentials } = await oauth2Client.refreshAccessToken();
    if (!credentials.access_token)
      throw new Error("Failed to get access token");

    return credentials.access_token;
  }
}

export const authRepo = new AuthRepository();
