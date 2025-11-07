import { Task } from "../../../shared/models/task";

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
  weight: ["number", "undefined"],
  dueDate: ["date", "undefined", "null"],
  description: ["string", "undefined"],
  grade: ["number", "null", "undefined"],
  priority: ["number", "null", "undefined"],
  createdAt: ["date", "null", "undefined"],
  lastUpdatedAt: ["date", "null", "undefined"],
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

    if (!expected)
      errors.push(
        `Provided field ${expected} is not a valid field for the type Task.`
      ); // Unknown field provided

    const expectedTypes: string[] = Array.isArray(expected)
      ? expected
      : [expected];
    const actualType = getType(value);

    if (!expectedTypes.includes(actualType)) {
      // Type provided for field is invalid.
      errors.push(
        `Invalid type for "${field}": expected ${expectedTypes.join(
          " | "
        )}, got ${actualType}`
      );
    }
  }
  return errors;
}

export function isTaskTypeValid(task: Task): boolean {
  const errors = validateTaskTypes(task);
  if (errors.length > 0) {
    console.error("Task validation errors:", errors);
    return false;
  }
  return true;
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
    weight: task.weight ?? -1, // No weight specified
    dueDate: task.dueDate ?? null,
    description: task.description ?? "",
    grade: task.grade ?? 0,
    priority: task.priority ?? -1, // No priority set
    createdAt: task.createdAt ?? now,
    lastUpdatedAt: task.lastUpdatedAt ?? now,
  };
}
