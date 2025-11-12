import admin from "../firebase_admin";
import { Course } from "../../../shared/models/course";

export class CourseRepository {
  private db = admin.firestore();

  async getAllCourses(userId: string): Promise<Course[]> {
    const snapshot = await this.db
      .collection("courses")
      .where("userId", "==", userId)
      .get();

    if (snapshot.empty) {
      throw new Error("Courses not found");
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data() as Course;
      return { ...data, courseId: doc.id };
    });
  }

  async getSingleCourse(userId: string, courseId: string): Promise<Course> {
    const doc = await this.db.collection("courses").doc(courseId).get();
    if (!doc.exists) {
      throw new Error("Course not found");
    }

    const data = doc.data() as Course;
    if (data.userId !== userId) {
      throw new Error("Unauthorized: user does not own this course");
    }

    return { ...data, courseId: doc.id };
  }

  async createCourse(course: Course): Promise<Course> {
    const docRef = this.db.collection("courses").doc(); // create doc reference manually
    const courseWithId: Course = { ...course, courseId: docRef.id };

    await docRef.set(courseWithId); // explicitly write the course with the ID included
    return courseWithId;
  }

  async deleteCourse(userId: string, courseId: string): Promise<void> {
    const courseRef = this.db.collection("courses").doc(courseId);
    const doc = await courseRef.get();

    if (!doc.exists) {
      throw new Error("Course not found");
    }

    const data = doc.data() as Course;
    if (data.userId !== userId) {
      throw new Error("Unauthorized: user does not own this course");
    }

    await courseRef.delete();
  }

  async updateCourse(
    userId: string,
    courseId: string,
    data: Partial<Course>
  ): Promise<void> {
    const courseRef = this.db.collection("courses").doc(courseId);
    const doc = await courseRef.get();

    if (!doc.exists) {
      throw new Error("Course not found");
    }

    const docData = doc.data() as Course;
    if (docData.userId !== userId) {
      throw new Error("Unauthorized: user does not own this course");
    }

    await courseRef.update(data);
  }
}

export const courseRepo = new CourseRepository();
