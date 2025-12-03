import { Request, Response } from "express";
import { courseWithTaskRepo } from "../repositories/courseWithTasksRepository";
import type {
  NumericFieldValidationResult,
  ValidationResult,
} from "../../../shared/models/validation";
import {
  attemptsToUpdateImmutable as attemptsToUpdateImmutableCourse,
  hasRequiredFields as hasCourseRequiredFields,
  isCourseTypeValid,
  setCourseDefaults,
  validateNumericCourseFieldValues,
} from "../utils/courseUtils";
import {
  attemptsToUpdateImmutable as attemptsToUpdateImmutableTask,
  setTaskDefaults,
  hasRequiredFields as hasTaskRequiredFields,
  isTaskTypeValid,
  normalizeTaskDates,
  validateNumericTakFieldValues,
} from "../utils/taskUtils";
import { Course } from "../../../shared/models/course";
import { Task } from "../../../shared/models/task";
export async function createCourseWithTasks(req: Request, res: Response) {
  const { course: coursePayload, tasks: tasksPayload } = req.body;
  let errorMessage: string;

  try {
    // --- Validate Course ---
    if (!hasCourseRequiredFields(coursePayload)) {
      errorMessage =
        "Course payload missing required fields: userId or courseName";
      return res.status(400).json({ message: errorMessage });
    }

    const typeValidation: ValidationResult = isCourseTypeValid(coursePayload);
    if (!typeValidation.isValid) {
      return res.status(400).json({ message: typeValidation.firstError });
    }

    const numericValidation: NumericFieldValidationResult =
      validateNumericCourseFieldValues(coursePayload);
    if (!numericValidation.isValid) {
      return res.status(400).json({ message: numericValidation.firstError });
    }

    const validatedCourse: Course = setCourseDefaults(coursePayload);

    // --- Validate Tasks ---
    const validatedTasks: Task[] = [];
    for (const rawTask of tasksPayload) {
      const normalizedTask = normalizeTaskDates(rawTask);

      if (!hasTaskRequiredFields(normalizedTask)) {
        errorMessage = "Each task requires userId, title, and courseId";
        return res.status(400).json({ message: errorMessage });
      }

      const taskTypeValidation: ValidationResult =
        isTaskTypeValid(normalizedTask);
      if (!taskTypeValidation.isValid) {
        return res.status(400).json({ message: taskTypeValidation.firstError });
      }

      const numericTaskValidation: NumericFieldValidationResult =
        validateNumericTakFieldValues(normalizedTask);
      if (!numericTaskValidation.isValid) {
        return res
          .status(400)
          .json({ message: numericTaskValidation.firstError });
      }

      validatedTasks.push(setTaskDefaults(normalizedTask));
    }

    // --- Create Course + Tasks Atomically ---
    const { course, tasks } = await courseWithTaskRepo.createCourseWithTasks(
      validatedCourse,
      validatedTasks
    );

    return res.status(201).json({
      message: "Successfully created course with tasks",
      course,
      tasks,
    });
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error creating course with tasks:", err);
    return res.status(400).json({ message: errorMessage });
  }
}
