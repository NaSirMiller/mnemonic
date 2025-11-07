// types/task.ts
export interface Task {
  userId?: string;
  title?: string;
  courseId?: string;
  taskId?: string;
  weight?: number; // 0–1 or -1
  dueDate?: Date | null;
  description?: string;
  grade?: number; // 0–1
  priority?: number; // -1 or 0 to n
  createdAt?: Date | null;
  lastUpdatedAt?: Date | null;
}

export interface ValidationResult {
  isValid: boolean;
  firstError: string | null;
}

export interface NumericFieldValidationResult {
  isValid: boolean;
  firstError?: string;
}
