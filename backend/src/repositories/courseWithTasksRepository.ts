import admin from "../firebaseAdmin";
import { Course } from "../../../shared/models/course";
import { Task } from "../../../shared/models/task";

export class CourseWithTasksRepository {
  private db = admin.firestore();

  async createCourseWithTasks(
    course: Course,
    tasks: Task[]
  ): Promise<{ course: Course; tasks: Task[] }> {
    const batch = this.db.batch();

    // Create course doc reference
    const courseDocRef = this.db.collection("courses").doc();
    const courseWithId: Course = { ...course, courseId: courseDocRef.id };
    batch.set(courseDocRef, courseWithId);

    // Prepare tasks
    const tasksWithIds: Task[] = tasks.map((task) => {
      const docRef = this.db.collection("tasks").doc();
      batch.set(docRef, {
        ...task,
        taskId: docRef.id,
        courseId: courseDocRef.id,
      });
      return { ...task, taskId: docRef.id, courseId: courseDocRef.id };
    });

    // Commit batch
    await batch.commit();

    return { course: courseWithId, tasks: tasksWithIds };
  }
}

export const courseWithTaskRepo = new CourseWithTasksRepository();
