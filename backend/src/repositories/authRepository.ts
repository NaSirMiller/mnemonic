import admin from "../firebase_admin";
import { User, UserModel, UserUpdate } from "../../../shared/models/user";
import { google } from "googleapis";

export class AuthRepository {
  private db = admin.firestore();

  /**
   *
   * @param idToken Provided id token based on user's Google auth request
   * @returns true iff the token could be verified by firebase
   */
  async isValidIdToken(idToken: string): Promise<boolean> {
    try {
      await admin.auth().verifyIdToken(idToken, true);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async createUser(user: User): Promise<User> {
    let validatedUser: UserModel;
    try {
      validatedUser = new UserModel(user);
    } catch (err) {
      console.error(err);
      throw err;
    }

    const docRef = this.db.collection("users").doc(validatedUser.userId);
    await docRef.set(validatedUser.toJson());

    const newDoc = await docRef.get();
    const firestoreDocData = newDoc.data() as User;

    const newUser = UserModel.fromJson({
      ...firestoreDocData,
      userId: newDoc.id,
    });

    return newUser.toJson();
  }

  async getUser(userId: string): Promise<User> {
    const doc = await this.db.collection("users").doc(userId).get();
    if (!doc.exists) {
      throw new Error("User not found");
    }

    const data = doc.data() as User;
    return UserModel.fromJson(data).toJson();
  }

  async updateUser(userId: string, data: UserUpdate): Promise<void> {
    const userRef = this.db.collection("users").doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      // If user doesn't exist, create it with the given data
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

    const data = userDoc.data();
    if (!data) throw new Error("No user data found in Firestore document");

    // Include the document ID explicitly
    const userData = UserModel.fromJson({
      ...data,
      userId: userDoc.id,
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
