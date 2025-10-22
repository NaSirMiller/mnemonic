export interface Task {
  userId: string;
  title: string;
  courseId: string;
  weight: number; // 0 to 1
  dueDate: Date;
  description?: string;
  grade?: number | null; // 0 to 1
  lastProgressed?: Date | null;
  timeSpent?: number | null;
  isComplete?: boolean | null;
  priority?: number | null;
  createdAt?: Date | null;
  lastUpdatedAt?: Date | null;
}

export type TaskUpdate = Partial<Task>; // Permits adding only subsets of the data for updates

export class TaskModel implements Task {
  userId: string;
  title: string;
  courseId: string;
  weight: number;
  dueDate: Date;
  description?: string;
  grade?: number | null;
  lastProgressed?: Date | null;
  timeSpent: number;
  isComplete: boolean;
  priority?: number | null;
  createdAt: Date;
  lastUpdatedAt: Date;

  constructor(data: Task | TaskUpdate) {
    // Decide which validation to run
    if (TaskModel._isFullTask(data)) {
      this._validateTask(data);
    } else {
      this._validateTaskUpdate(data);
    }

    this.userId = data.userId!;
    this.title = data.title!;
    this.courseId = data.courseId!;
    this.weight = data.weight!;
    this.dueDate = data.dueDate!;
    this.description = data.description ?? "";
    this.grade = data.grade ?? null;
    this.lastProgressed = data.lastProgressed ?? null;
    this.timeSpent = data.timeSpent ?? 0;
    this.isComplete = data.isComplete ?? false;
    this.priority = data.priority ?? null;
    this.createdAt = data.createdAt ?? new Date();
    this.lastUpdatedAt = data.lastUpdatedAt ?? new Date();
  }

  // --- TYPE GUARD ---
  private static _isFullTask(data: Task | TaskUpdate): data is Task {
    return (
      typeof data.userId === "string" &&
      typeof data.title === "string" &&
      typeof data.courseId === "string" &&
      typeof data.weight === "number" &&
      data.dueDate instanceof Date
    );
  }

  private _validateTask(data: Task): void {
    if (!data.userId || typeof data.userId !== "string")
      throw new Error("userId must be a string");
    if (!data.courseId || typeof data.courseId !== "string")
      throw new Error("courseId must be a string");
    if (typeof data.weight !== "number" || data.weight < 0 || data.weight > 1)
      throw new Error("weight must be a number between 0 and 1");
    if (!data.dueDate || !(data.dueDate instanceof Date))
      throw new Error("dueDate must be a Date");

    // Optional fields
    this._validateOptionalFields(data);
  }

  private _validateTaskUpdate(data: TaskUpdate): void {
    // Only validate fields that are *present*
    for (const [key, value] of Object.entries(data)) {
      switch (key) {
        case "title":
          if (typeof value !== "string")
            throw new Error(`${key} must be a string`);
          break;
        case "courseId":
          if (typeof value !== "string")
            throw new Error(`${key} must be a string`);
          break;
        case "weight":
          if (typeof value !== "number" || value < 0 || value > 1)
            throw new Error("weight must be a number between 0 and 1");
          break;
        case "dueDate":
          if (!(value instanceof Date))
            throw new Error("dueDate must be a Date");
          break;
        case "description":
          if (typeof value !== "string")
            throw new Error("description must be a string");
          break;
        case "grade":
          if (value !== null && typeof value !== "number")
            throw new Error("grade must be a number or null");
          break;
        case "lastProgressed":
          if (value !== null && !(value instanceof Date))
            throw new Error(`${key} must be a Date or null`);
          break;
        case "createdAt":
          if (value !== null && !(value instanceof Date))
            throw new Error(`${key} must be a Date or null`);
          break;
        case "lastUpdatedAt":
          if (value !== null && !(value instanceof Date))
            throw new Error(`${key} must be a Date or null`);
          break;
        case "timeSpent":
          if (typeof value !== "number")
            throw new Error("timeSpent must be a number");
          break;
        case "isComplete":
          if (typeof value !== "boolean")
            throw new Error("isComplete must be a boolean");
          break;
        case "priority":
          if (value !== null && typeof value !== "number")
            throw new Error("priority must be a number or null");
          break;
      }
    }
  }

  private _validateOptionalFields(data: Task): void {
    if (data.description && typeof data.description !== "string")
      throw new Error("description must be a string");
    if (data.grade && typeof data.grade !== "number")
      throw new Error("grade must be a number");
    if (data.lastProgressed && !(data.lastProgressed instanceof Date))
      throw new Error("lastProgressed must be a Date");
    if (data.timeSpent && typeof data.timeSpent !== "number")
      throw new Error("timeSpent must be a number");
    if (data.isComplete && typeof data.isComplete !== "boolean")
      throw new Error("isComplete must be a boolean");
    if (data.priority && typeof data.priority !== "number")
      throw new Error("priority must be a number");
    if (data.createdAt && !(data.createdAt instanceof Date))
      throw new Error("createdAt must be a Date");
    if (data.lastUpdatedAt && !(data.lastUpdatedAt instanceof Date))
      throw new Error("lastUpdatedAt must be a Date");
  }

  public toJson(): { [key: string]: any } {
    return {
      userId: this.userId,
      title: this.title,
      courseId: this.courseId,
      weight: this.weight,
      dueDate: this.dueDate, // serialize Date to string
      description: this.description,
      grade: this.grade,
      lastProgressed: this.lastProgressed ?? null,
      timeSpent: this.timeSpent,
      isComplete: this.isComplete,
      priority: this.priority,
      createdAt: this.createdAt,
      lastUpdatedAt: this.lastUpdatedAt,
    };
  }
}
