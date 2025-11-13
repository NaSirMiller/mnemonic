// types/task.ts
export interface Task {
  userId?: string;
  title?: string;
  courseId?: string;
  taskId?: string;
  currentTime?: number; // in mins
  expectedTime?: number; // in mins
  weight?: number; // 0–1 or -1
  gradeType?: string; 
  dueDate?: Date | null;
  description?: string;
  grade?: number; // 0–1
  priority?: number; // -1 or 0 to n
  createdAt?: Date | null;
  lastUpdatedAt?: Date | null;
}
