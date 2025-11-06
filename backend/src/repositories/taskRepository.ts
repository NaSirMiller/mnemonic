import admin from "../firebase_admin";
import { Task, TaskModel, TaskUpdate } from "../../../shared/models/task";

export class TaskRepository {
  private db = admin.firestore();
  async getAllUserTasks(userId: string): Promise<Task[]> {
    const snapshot = await this.db
      .collection("tasks")
      .where("userId", "==", userId)
      .get();
    let docAsTask: Task;
    return snapshot.docs.map((doc) => {
      docAsTask = doc.data() as Task;
      const task = TaskModel.fromJson({ ...docAsTask, taskId: doc.id });
      return task.toJson();
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
    let docAsTask: Task = data as Task;
    const task = TaskModel.fromJson({ ...docAsTask, taskId: doc.id });
    return task.toJson();
  }

  async createTask(task: Task): Promise<Task> {
    let validatedTask;
    try {
      validatedTask = new TaskModel(task);
    } catch (err) {
      console.error(err);
      throw err;
    }

    const docRef = await this.db
      .collection("tasks")
      .add(validatedTask.toJson());

    const newDoc = await docRef.get();
    const firestoreDocData = newDoc.data() as Task;

    const newTask = TaskModel.fromJson({
      ...firestoreDocData,
      taskId: newDoc.id,
    });

    return newTask.toJson();
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
    data: TaskUpdate
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

    // Validate the update using TaskModel
    TaskModel.fromJson({
      ...docData,
      ...data,
    }).toJson();

    await taskRef.update(data);
  }
}

export const taskRepo = new TaskRepository();
