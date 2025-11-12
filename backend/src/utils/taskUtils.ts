import { Task } from "../../../shared/models/task";
import {
  NumericFieldValidationResult,
  ValidationResult,
} from "../../../shared/models/validation";

/** Field validation*/
type ExpectedType =
  | "string"
  | "number"
  | "date"
  | "null"
  | "undefined"
  | "boolean";

const TaskFieldTypes: Record<keyof Task, ExpectedType | ExpectedType[]> = {
  userId: ["string", "undefined"],
  title: ["string", "undefined"],
  courseId: ["string", "undefined"],
  taskId: ["string", "undefined"],
  expectedTime: ["number", "undefined"],
  currentTime: ["number", "undefined"],
  weight: ["number", "undefined"],
  dueDate: ["date", "undefined", "null"],
  description: ["string", "undefined"],
  grade: ["number", "null", "undefined"],
  priority: ["number", "null", "undefined"],
  createdAt: ["date", "null", "undefined"],
  lastUpdatedAt: ["date", "null", "undefined"],
  googleEventId: ["string", "null", "undefined"],
};
function getType(value: any): ExpectedType {
  if (value === null) return "null";
  if (value instanceof Date) return "date";
  return typeof value as ExpectedType;
}

export function validateTaskTypes(task: Task): string[] {
  const errors: string[] = [];
  for (const [key, value] of Object.entries(task)) {
    const field = key as keyof Task;
    const expected = TaskFieldTypes[field];

    if (!expected) {
      errors.push(`Provided field "${key}" is not a valid field for the type Task.`);
      continue; // skip further checks
    }

    const expectedTypes: string[] = Array.isArray(expected) ? expected : [expected];
    const actualType = getType(value);

    if (!expectedTypes.includes(actualType)) {
      errors.push(
        `Invalid type for "${field}": expected ${expectedTypes.join(" | ")}, got ${actualType}`
      );
    }
  }
  return errors;
}


export function isTaskTypeValid(task: Task): ValidationResult {
  const errors = validateTaskTypes(task);
  for (let i = 0; i < errors.length; i++) {
    console.error("Error occurred while validating tasks object:", errors[i]);
    return { isValid: false, firstError: errors[i] };
  }
  return { isValid: true, firstError: null };
}

export function attemptsToUpdateImmutable(task: Task): boolean {
  return !!(task.taskId || task.userId);
}

export function hasRequiredFields(task: Task): boolean {
  if (!task.userId || typeof task.userId !== "string") return false;
  if (!task.title || typeof task.title !== "string") return false;
  if (!task.courseId || typeof task.courseId !== "string") return false;
  return true;
}

/**
 * Apply defaults to optional fields, ensuring consistent shape before saving.
 */
export function setTaskDefaults(task: Task): Task {
  const now = new Date();
  return {
    userId: task.userId!,
    title: task.title!,
    courseId: task.courseId!,
    currentTime: 0,
    expectedTime: 0,
    weight: task.weight ?? -1, // No weight specified
    dueDate: task.dueDate ?? null,
    description: task.description ?? "",
    grade: task.grade ?? 0,
    priority: task.priority ?? -1, // No priority set
    createdAt: task.createdAt ?? now,
    lastUpdatedAt: task.lastUpdatedAt ?? now,
  };
}

/**
 * Validates the values of specific fields in a Task object.
 * Rules:
 *  - weight: 0–1 or -1
 *  - priority: -1 to n
 *  - grade: 0–1 or null
 */
export function validateNumericTakFieldValues(
  task: Task
): NumericFieldValidationResult {
  // Validate weight
  if (task.weight !== undefined) {
    if (!(task.weight >= 0 && task.weight <= 1) && task.weight !== -1) {
      return {
        isValid: false,
        firstError: `Invalid weight: ${task.weight}. Must be 0–1 or -1.`,
      };
    }
  }

  // Validate priority
  if (task.priority !== undefined) {
    if (!(task.priority >= -1)) {
      return {
        isValid: false,
        firstError: `Invalid priority: ${task.priority}. Must be -1 or greater.`,
      };
    }
  }

  // Validate grade
  if (task.grade !== undefined && task.grade !== null) {
    if (!(task.grade >= 0 && task.grade <= 1)) {
      return {
        isValid: false,
        firstError: `Invalid grade: ${task.grade}. Must be 0–1 or null.`,
      };
    }
  }

  return { isValid: true };
}

export function normalizeTaskDates(task: Task): Task {
  const normalizedTask: Task = { ...task };

  if (task.dueDate instanceof Date) {
    normalizedTask.dueDate = task.dueDate;
  } else if (
    typeof task.dueDate === "string" ||
    typeof task.dueDate === "number"
  ) {
    const d = new Date(task.dueDate);
    normalizedTask.dueDate = isNaN(d.getTime()) ? undefined : d;
  }

  // Handle createdAt (nullable)
  if (task.createdAt instanceof Date) {
    normalizedTask.createdAt = task.createdAt;
  } else if (
    typeof task.createdAt === "string" ||
    typeof task.createdAt === "number"
  ) {
    const d = new Date(task.createdAt);
    normalizedTask.createdAt = isNaN(d.getTime()) ? null : d;
  }
  // Handle lastUpdatedAt (nullable)
  if (task.lastUpdatedAt instanceof Date) {
    normalizedTask.lastUpdatedAt = task.lastUpdatedAt;
  } else if (
    typeof task.lastUpdatedAt === "string" ||
    typeof task.lastUpdatedAt === "number"
  ) {
    const d = new Date(task.lastUpdatedAt);
    normalizedTask.lastUpdatedAt = isNaN(d.getTime()) ? null : d;
  }

  return normalizedTask;
}
