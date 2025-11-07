export interface Task {
  taskId?: string | null;
  userId: string;
  title: string;
  courseId: string;
  weight: number; // 0–1
  dueDate: Date;
  description?: string | null;
  grade?: number | null;
  lastProgressed?: Date | null;
  timeSpent?: number | null;
  isComplete?: boolean | null;
  priority?: number | null;
  createdAt?: Date | null;
  lastUpdatedAt?: Date | null;
}

export type TaskUpdate = Partial<Task>;

export class TaskModel implements Task {
  taskId: string | null = null;
  userId: string;
  title: string;
  courseId: string;
  weight: number;
  dueDate: Date;
  description: string | null = null;
  grade: number | null = null;
  lastProgressed: Date | null = null;
  timeSpent: number = 0;
  isComplete: boolean = false;
  priority: number | null = null;
  createdAt: Date = new Date();
  lastUpdatedAt: Date = new Date();

  constructor(data: Task | TaskUpdate) {
    const normalized = TaskModel._normalizeDates(data);

    if (TaskModel._isFullTask(normalized)) {
      this._validateFullTask(normalized);
    } else {
      this._validatePartialTask(normalized);
    }

    this.taskId = normalized.taskId ?? null;
    this.userId = normalized.userId!;
    this.title = normalized.title!;
    this.courseId = normalized.courseId!;
    this.weight = normalized.weight!;
    this.dueDate = new Date(normalized.dueDate!);
    this.description = normalized.description ?? null;
    this.grade = normalized.grade ?? null;
    this.lastProgressed = normalized.lastProgressed ?? null;
    this.timeSpent = normalized.timeSpent ?? 0;
    this.isComplete = normalized.isComplete ?? false;
    this.priority = normalized.priority ?? null;
    this.createdAt = normalized.createdAt ?? new Date();
    this.lastUpdatedAt = normalized.lastUpdatedAt ?? new Date();
  }

  // Normalize string dates → Date objects
  private static _normalizeDates(data: Task | TaskUpdate): Task | TaskUpdate {
    const copy = { ...data } as any;
    const dateFields = [
      "dueDate",
      "lastProgressed",
      "createdAt",
      "lastUpdatedAt",
    ];

    dateFields.forEach((field) => {
      const val = copy[field];
      if (val && !(val instanceof Date)) {
        copy[field] = new Date(val);
      }
    });

    return copy;
  }

  private static _isFullTask(data: Task | TaskUpdate): data is Task {
    return (
      typeof data.userId === "string" &&
      typeof data.title === "string" &&
      typeof data.courseId === "string" &&
      typeof data.weight === "number" &&
      data.dueDate instanceof Date
    );
  }

  private _validateFullTask(data: Task): void {
    if (!data.userId || typeof data.userId !== "string")
      throw new Error("userId must be a string");
    if (!data.title || typeof data.title !== "string")
      throw new Error("title must be a string");
    if (!data.courseId || typeof data.courseId !== "string")
      throw new Error("courseId must be a string");
    if (typeof data.weight !== "number" || data.weight < 0 || data.weight > 1)
      throw new Error("weight must be between 0 and 1");
    if (!data.dueDate || !(data.dueDate instanceof Date))
      throw new Error("dueDate must be a Date");
  }

  private _validatePartialTask(data: TaskUpdate): void {
    for (const [key, value] of Object.entries(data)) {
      if (
        ["dueDate", "lastProgressed", "createdAt", "lastUpdatedAt"].includes(
          key
        ) &&
        value !== null &&
        value !== undefined &&
        !(value instanceof Date)
      ) {
        throw new Error(`${key} must be a Date or null`);
      }
    }
  }

  public toJson(): Task {
    return {
      taskId: this.taskId,
      userId: this.userId,
      title: this.title,
      courseId: this.courseId,
      weight: this.weight,
      dueDate: this.dueDate,
      description: this.description,
      grade: this.grade,
      lastProgressed: this.lastProgressed,
      timeSpent: this.timeSpent,
      isComplete: this.isComplete,
      priority: this.priority,
      createdAt: this.createdAt,
      lastUpdatedAt: this.lastUpdatedAt,
    };
  }

  static fromJson(json: Task): TaskModel {
    return new TaskModel({
      ...json,
      dueDate: new Date(json.dueDate),
      lastProgressed: json.lastProgressed
        ? new Date(json.lastProgressed)
        : null,
      createdAt: json.createdAt ? new Date(json.createdAt) : new Date(),
      lastUpdatedAt: json.lastUpdatedAt
        ? new Date(json.lastUpdatedAt)
        : new Date(),
    });
  }
}
