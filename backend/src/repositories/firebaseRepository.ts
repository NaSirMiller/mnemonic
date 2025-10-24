import admin from "firebase-admin";
import { Task, TaskModel, TaskUpdate } from "../models/task";
import { Course, CourseModel, CourseUpdate} from "../models/course"

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
    const docRef = await this.db.collection("tasks").add(task);
    const newDoc = await docRef.get();
    const firestoreDocData = newDoc.data() as Task;
    let newTask = TaskModel.fromJson({
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






  async getAllCourses(userId: string): Promise<Task[]> {
    const snapshot = await this.db
      .collection("courses")
      .where("userId", "==", userId)
      .get();
    let docAsCourse: Course;
    return snapshot.docs.map((doc) => {
      docAsCourse = doc.data() as Course;
      const course = CourseModel.fromJson({ ...docAsCourse});
      return course.toJson();
    });
  }

  async getSingleCourse(userId: string, courseName: string): Promise<Course> {
    const doc = await this.db.collection("courses").doc(courseName).get();
    if (!doc.exists) {
      throw new Error("Task not found");
    }

    const data = doc.data() as Course;
    if (data?.userId !== userId) {
      throw new Error("Unauthorized: user does not own this course");
    }
    let docAsCourse: Course = data as Course;
    const task = CourseModel.fromJson({ ...docAsCourse});
    return task.toJson();
  }

  async createCourse(course: Course): Promise<Course> {
    const docRef = await this.db.collection("courses").add(course);
    const newDoc = await docRef.get();
    const firestoreDocData = newDoc.data() as Course;
    let newTask = CourseModel.fromJson({
      ...firestoreDocData
    });
    return newTask.toJson();
  }

  async deleteCourse(userId: string, courseName: string): Promise<void> {
    const taskRef = this.db.collection("courses").doc(courseName);
    const doc = await taskRef.get();

    if (!doc.exists) {
      throw new Error("Course not found");
    }

    const data = doc.data();
    if (data?.userId !== userId) {
      throw new Error("Unauthorized: user does not own this course");
    }

    await taskRef.delete();
  }

  async updateCourse(
    userId: string,
    courseName: string,
    data: CourseUpdate
  ): Promise<void> {
    const courseRef = this.db.collection("courses").doc(courseName);
    const doc = await courseRef.get();

    if (!doc.exists) {
      throw new Error("Task not found");
    }

    const docData = doc.data() as Course | undefined;
    if (!docData || docData.userId !== userId) {
      throw new Error("Unauthorized: user does not own this course");
    }

    // Validate the update using CourseModel
    CourseModel.fromJson({
      ...docData,
      ...data,
    }).toJson();

    await courseRef.update(data);
  }
}

export const firebaseRepo = new FirebaseRepository();
