import admin from "../firebase_admin";
import {
  Course,
  CourseModel,
  CourseUpdate,
} from "../../../shared/models/course";

export class CourseRepository {
  private db = admin.firestore();

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
      const course = CourseModel.fromJson({ ...docAsCourse });
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
    const course = CourseModel.fromJson({ ...docAsCourse });
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

    const exists = await this.db
      .collection("courses")
      .doc(course.courseId)
      .get();
    if (exists.exists) {
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
    console.log(courseId);
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
}

export const courseRepo = new CourseRepository();
