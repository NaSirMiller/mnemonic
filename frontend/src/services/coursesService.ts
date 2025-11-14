import {
  createCourse as createCourseApi,
  getCourses as getCoursesApi,
  updateCourse as updateCourseApi,
  deleteCourse as deleteCourseApi,
} from "../api";

import type { Course } from "../../../shared/models/course";

export class CreateCourseError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, CreateCourseError.prototype);
  }
}

export class GetCoursesError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, GetCoursesError.prototype);
  }
}

export class UpdateCourseError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, UpdateCourseError.prototype);
  }
}

export class DeleteCourseError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, DeleteCourseError.prototype);
  }
}

export async function createCourse(coursePayload: Course): Promise<Course> {
  try {
    const createdCourse = await createCourseApi(coursePayload); 
    console.log("Course created.");
    return createdCourse; 
  } catch (error) {
    if (error instanceof Error) {
      console.error("Course could not be created: ", error.message);
      throw new CreateCourseError(
        `Error creating given course: ${error.message}`,
        "api-error"
      );
    } else {
      console.error("Unknown course creation error", error);
      throw new CreateCourseError(
        "Unknown error during course creation",
        "unknown"
      );
    }
  }
}


export async function getCourses(
  userId: string,
  courseId: string | null
): Promise<Course[]> {
  try {
    const coursesResponse = await getCoursesApi(userId, courseId);
    const courses: Course[] = coursesResponse.courses ?? [];
    console.log(`Retrieved ${courses.length} courses.`);
    return courses;
  } catch (error) {
    console.error(
      courseId === null ? "Could not get user courses: " : "Could not get specified course",
      (error as Error).message
    );
    // Return empty array instead of throwing
    return [];
  }
}



export async function updateCourse(
  userId: string,
  courseId: string,
  coursePayload: Course
): Promise<void> {
  try {
    await updateCourseApi(userId, courseId, coursePayload);
    console.log("Course updated.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Course could not be updated: ", error.message);
      throw new UpdateCourseError(
        `Error updating given course: ${error.message}`,
        "api-error"
      );
    } else {
      console.error("Unknown course update error", error);
      throw new UpdateCourseError(
        "Unknown error during course update",
        "unknown"
      );
    }
  }
}

export async function deleteCourse(
  userId: string,
  courseId: string
): Promise<void> {
  try {
    await deleteCourseApi(userId, courseId);
    console.log("Course deleted.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Course could not be deleted: ", error.message);
      throw new DeleteCourseError(
        `Error deleting given course: ${error.message}`,
        "api-error"
      );
    } else {
      console.error("Unknown course deletion error", error);
      throw new DeleteCourseError(
        "Unknown error during course deletion",
        "unknown"
      );
    }
  }
}
