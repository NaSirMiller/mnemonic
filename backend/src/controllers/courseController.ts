import { Request, Response } from "express";
import { courseRepo } from "../repositories/courseRepository";
import { taskRepo } from "../repositories/taskRepository";
import { deleteCalendarEvent } from "../utils/googleCalendar";
import type {
  NumericFieldValidationResult,
  ValidationResult,
} from "../../../shared/models/validation";
import {
  attemptsToUpdateImmutable,
  hasRequiredFields,
  isCourseTypeValid,
  setCourseDefaults,
  validateNumericCourseFieldValues,
} from "../utils/courseUtils";
import { Course } from "../../../shared/models/course";

export async function createCourse(request: Request, response: Response) {
  const coursePayload = request.body;
  let errorMessage: string;

  try {
    // Ensure no courseId is set in payload
    if (coursePayload.courseId) coursePayload.courseId = null;

    // Required fields validation
    if (!hasRequiredFields(coursePayload)) {
      errorMessage = "Payload is missing required fields: userId or courseName";
      return response.status(400).json({ message: errorMessage });
    }

    // Field types validation
    const typeValidation: ValidationResult = isCourseTypeValid(coursePayload);
    if (!typeValidation.isValid) {
      errorMessage = typeValidation.firstError!;
      return response.status(400).json({ message: errorMessage });
    }

    // Numeric field validation
    const numericValidation: NumericFieldValidationResult =
      validateNumericCourseFieldValues(coursePayload);
    if (!numericValidation.isValid) {
      errorMessage = numericValidation.firstError!;
      return response.status(400).json({ message: errorMessage });
    }

    // Apply defaults
    const validatedCourse: Course = setCourseDefaults(coursePayload);

    // Create in repository
    const createdCourse: Course = await courseRepo.createCourse(
      validatedCourse
    );

    return response.status(201).json({
      message: "Successfully created a course",
      course: createdCourse,
    });
  } catch (err) {
    if (err instanceof Error) {
      errorMessage = err.message;
      console.error("Error creating course:", err);
    } else {
      errorMessage = "Unknown error occurred while creating course.";
      console.error(err);
    }
    return response.status(400).json({ message: errorMessage });
  }
}

export async function getCourse(request: Request, response: Response) {
  const { userId } = request.params;
  const courseId = request.query.courseId as string | undefined;
  let coursesRetrieved: Course[];

  try {
    if (!courseId) {
      coursesRetrieved = await courseRepo.getAllCourses(userId);
    } else {
      const course = await courseRepo.getSingleCourse(userId, courseId);
      coursesRetrieved = [course];
    }

    return response.status(200).json({
      message: "Successfully retrieved courses",
      courses: coursesRetrieved,
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Unknown error while retrieving courses.";
    console.error(err);
    return response.status(400).json({ message: errorMessage });
  }
}

export async function updateCourse(request: Request, response: Response) {
  const { userId, courseId } = request.params;
  const coursePayload = request.body;

  let errorMessage: string;

  try {
    if (attemptsToUpdateImmutable(coursePayload)) {
      errorMessage = "Cannot update userId or courseId of a course.";
      return response.status(400).json({ message: errorMessage });
    }

    // Validate types
    const typeValidation: ValidationResult = isCourseTypeValid(coursePayload);
    if (!typeValidation.isValid) {
      errorMessage = typeValidation.firstError!;
      return response.status(400).json({ message: errorMessage });
    }

    // Numeric fields validation
    const numericValidation: NumericFieldValidationResult =
      validateNumericCourseFieldValues(coursePayload);
    if (!numericValidation.isValid) {
      errorMessage = numericValidation.firstError!;
      return response.status(400).json({ message: errorMessage });
    }

    await courseRepo.updateCourse(userId, courseId, coursePayload);

    return response.status(200).json({
      message: `Successfully updated course ${coursePayload.courseName}.`,
    });
  } catch (err) {
    errorMessage =
      err instanceof Error
        ? err.message
        : "Unknown error while updating course.";
    console.error(err);
    return response.status(400).json({ message: errorMessage });
  }
}

export async function deleteCourse(request: Request, response: Response) {
  const { userId, courseId } = request.params;
  let errorMessage: string;

  try {
    // Get all tasks for this course
    const tasks = await taskRepo.getAllUserTasks(userId, courseId);

    // Delete each task + its Google Calendar event
    for (const task of tasks) {
      try {
        await taskRepo.deleteTask(userId, task.taskId!);

        if (task.googleEventId) {
          await deleteCalendarEvent(userId, task.googleEventId);
        }
      } catch (err) {
        console.error(`Error deleting task ${task.taskId}:`, err);
      }
    }

    // Delete the course itself
    await courseRepo.deleteCourse(userId, courseId);

    return response.status(200).json({
      message: `Successfully deleted course ${courseId} and all related tasks.`,
    });

  } catch (err) {
    errorMessage =
      err instanceof Error
        ? err.message
        : "Unknown error while deleting course.";
    console.error(err);
    return response.status(400).json({ message: errorMessage });
  }
}
