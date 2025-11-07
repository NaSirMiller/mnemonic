import admin from "../firebase_admin";
import { Task } from "../../../shared/models/task";

export class TaskRepository {
  private db = admin.firestore();

  async getAllUserTasks(userId: string): Promise<Task[]> {
    const snapshot = await this.db
      .collection("tasks")
      .where("userId", "==", userId)
      .get();

    return snapshot.docs.map((doc) => {
      const docData = doc.data() as Task;
      return { ...docData, taskId: doc.id };
    });
  }

  async getSingleUserTask(userId: string, taskId: string): Promise<Task> {
    const doc = await this.db.collection("tasks").doc(taskId).get();

    if (!doc.exists) {
      throw new Error("Task not found");
    }

    const data = doc.data() as Task;
    if (data?.userId !== userId) {
      throw new Error("Unauthorized: user does not own this task");
    }

    return { ...data, taskId: doc.id };
  }

  async createTask(task: Task): Promise<Task> {
    const docRef = await this.db.collection("tasks").add(task);
    const newDoc = await docRef.get();
    const firestoreDocData = newDoc.data() as Task;

    return { ...firestoreDocData, taskId: newDoc.id };
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

  async updateTask(
    userId: string,
    taskId: string,
    data: Partial<Task>
  ): Promise<void> {
    const taskRef = this.db.collection("tasks").doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) {
      throw new Error("Task not found");
    }

    const docData = doc.data() as Task | undefined;
    if (!docData || docData.userId !== userId) {
      throw new Error("Unauthorized: user does not own this task");
    }

    await taskRef.update(data);
  }
}

export const taskRepo = new TaskRepository();
