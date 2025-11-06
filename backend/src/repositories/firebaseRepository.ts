import admin from "../firebase_admin";
import { Task, TaskModel, TaskUpdate } from "../models/task";
import { Course, CourseModel, CourseUpdate} from "../models/course";
import { User, UserModel, UserUpdate } from "../models/user";
import { google } from "googleapis";

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
  async getAllCourses(userId: string): Promise<Course[]> {
    const snapshot = await this.db
      .collection("courses")
      .where("userId", "==", userId)
      .get();
    if (snapshot.size < 1) {
      console.log(snapshot.size);
      throw new Error("Courses not found");
    }
    let docAsCourse: Course;
    return snapshot.docs.map((doc) => {
      docAsCourse = doc.data() as Course;
      const course = CourseModel.fromJson({ ...docAsCourse});
      return course.toJson();
    });
  }

  async getSingleCourse(userId: string, courseId: string): Promise<Course> {
    const doc = await this.db.collection("courses").doc(courseId).get();
    if (!doc.exists) {
      throw new Error("Course not found");
    }

    const data = doc.data() as Course;
    if (data?.userId !== userId) {
      throw new Error("Unauthorized: user does not own this course");
    }
    let docAsCourse: Course = data as Course;
    const course = CourseModel.fromJson({ ...docAsCourse});
    return course.toJson();
  }

  async createCourse(course: Course): Promise<Course> {
    let validatedCourse;
    try {
      validatedCourse = new CourseModel(course);
    } catch (err) {
      console.error(err);
      throw err;
    }

    const exists = await this.db.collection("courses").doc(course.courseId).get();
    if (exists.exists){
      throw new Error("Course already exists");
    }
    const docRef = await this.db
      .collection("courses")
      .add(validatedCourse.toJson());

    const newDoc = await docRef.get();
    const firestoreDocData = newDoc.data() as Course;

    const newCourse = CourseModel.fromJson({
      ...firestoreDocData,
      courseId: newDoc.id,
    });

    return newCourse.toJson();
  }

  async deleteCourse(userId: string, courseId: string): Promise<void> {
    const courseRef = this.db.collection("courses").doc(courseId);
    const doc = await courseRef.get();

    if (!doc.exists) {
      throw new Error("Course not found");
    }

    const data = doc.data();
    if (data?.userId !== userId) {
      throw new Error("Unauthorized: user does not own this course");
    }

    await courseRef.delete();
  }

  async updateCourse(
    userId: string,
    courseId: string,
    data: CourseUpdate
  ): Promise<void> {
    console.log(courseId)
    const courseRef = this.db.collection("courses").doc(courseId);
    const doc = await courseRef.get();

    if (!doc.exists) {
      throw new Error("Course not found");
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

    const refreshToken = userData.refreshToken;
    if (!refreshToken) throw new Error("No refresh token stored for user");

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const { credentials } = await oauth2Client.refreshAccessToken();
    if (!credentials.access_token) throw new Error("Failed to get access token");

    return credentials.access_token;
  }

}


export const firebaseRepo = new FirebaseRepository();
