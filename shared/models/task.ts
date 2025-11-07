// types/task.ts
export interface Task {
  userId?: string;
  title?: string;
  courseId?: string;
  taskId?: string;
  weight?: number; // 0–1
  dueDate?: Date | null;
  description?: string;
  grade?: number | null; // 0–1
  priority?: number | null;
  createdAt?: Date | null;
  lastUpdatedAt?: Date | null;
}
