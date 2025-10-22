import admin from "firebase-admin";
import { Task, TaskUpdate } from "../models/task";

export class FirebaseRepository {
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

  async getTasksByUser(userId: string): Promise<Task[]> {
    const snapshot = await this.db
      .collection("tasks")
      .where("userId", "==", userId)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
  }

  async getTaskById(userId: string, taskId: string): Promise<Task | null> {
    const doc = await this.db.collection("tasks").doc(taskId).get();
    if (!doc.exists) return null;

    const data = doc.data() as Task;
    if (data.userId !== userId) return null;

    return { id: doc.id, ...data };
  }

  async createTask(task: Task): Promise<Task> {
    const docRef = await this.db.collection("tasks").add(task);
    const newDoc = await docRef.get();
    return { id: newDoc.id, ...newDoc.data() } as Task;
  }

  async updateTask(
    userId: string,
    taskId: string,
    data: TaskUpdate
  ): Promise<void> {
    const taskRef = this.db.collection("tasks").doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) {
      throw new Error("Task not found");
    }

    const docData = doc.data();
    if (docData?.userId !== userId) {
      throw new Error("Unauthorized: user does not own this task");
    }

    await taskRef.update(data);
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const taskRef = this.db.collection("tasks").doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) {
      throw new Error("Task not found");
    }

    const data = doc.data();
    if (data?.userId !== userId) {
      throw new Error("Unauthorized: user does not own this task");
    }

    await taskRef.delete();
  }
}

export const firebaseRepo = new FirebaseRepository();
