export interface Task {
  taskId?: string | null;
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

export type TaskUpdate = Partial<Task>;

export class TaskModel implements Task {
  private _taskId: string | null = null;
  private _userId!: string;
  private _title!: string;
  private _courseId!: string;
  private _weight!: number;
  private _dueDate!: Date;
  private _description?: string;
  private _grade?: number | null;
  private _lastProgressed?: Date | null;
  private _timeSpent!: number;
  private _isComplete!: boolean;
  private _priority?: number | null;
  private _createdAt!: Date;
  private _lastUpdatedAt!: Date;

  constructor(data: Task | TaskUpdate) {
    if (TaskModel._isFullTask(data)) {
      this._validateTask(data);
    } else {
      this._validateTaskUpdate(data);
    }

    this.taskId = data.taskId ?? null;
    this.userId = data.userId!;
    this.title = data.title!;
    this.courseId = data.courseId!;
    this.weight = data.weight!;
    this.dueDate = data.dueDate!;
    this.description = data.description;
    this.grade = data.grade ?? null;
    this.lastProgressed = data.lastProgressed ?? null;
    this.timeSpent = data.timeSpent ?? 0;
    this.isComplete = data.isComplete ?? false;
    this.priority = data.priority ?? null;
    this.createdAt = data.createdAt ?? new Date();
    this.lastUpdatedAt = data.lastUpdatedAt ?? new Date();
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

  private _validateTask(data: Task): void {
    if (!data.userId || typeof data.userId !== "string")
      throw new Error("userId must be a string");
    if (!data.courseId || typeof data.courseId !== "string")
      throw new Error("courseId must be a string");
    if (typeof data.weight !== "number" || data.weight < 0 || data.weight > 1)
      throw new Error("weight must be 0-1");
    if (!data.dueDate || !(data.dueDate instanceof Date))
      throw new Error("dueDate must be a Date");
    this._validateOptionalFields(data);
  }

  private _validateTaskUpdate(data: TaskUpdate): void {
    for (const [key, value] of Object.entries(data)) {
      switch (key) {
        case "title":
        case "courseId":
          if (typeof value !== "string")
            throw new Error(`${key} must be a string`);
          break;
        case "weight":
          if (typeof value !== "number" || value < 0 || value > 1)
            throw new Error("weight must be 0-1");
          break;
        case "dueDate":
          if (!(value instanceof Date))
            throw new Error("dueDate must be a Date");
          break;
        case "description":
          if (value !== undefined && typeof value !== "string")
            throw new Error("description must be a string");
          break;
        case "grade":
          if (
            value !== null &&
            value !== undefined &&
            typeof value !== "number"
          )
            throw new Error("grade must be number or null");
          break;
        case "lastProgressed":
        case "createdAt":
        case "lastUpdatedAt":
          if (value !== null && value !== undefined && !(value instanceof Date))
            throw new Error(`${key} must be a Date or null`);
          break;
        case "timeSpent":
          if (value !== undefined && typeof value !== "number")
            throw new Error("timeSpent must be a number");
          break;
        case "isComplete":
          if (value !== undefined && typeof value !== "boolean")
            throw new Error("isComplete must be boolean");
          break;
        case "priority":
          if (
            value !== null &&
            value !== undefined &&
            typeof value !== "number"
          )
            throw new Error("priority must be number or null");
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

  public toJson(): Task {
    return {
      taskId: this.taskId,
      userId: this.userId,
      title: this.title,
      courseId: this.courseId,
      weight: this.weight,
      dueDate: this.dueDate,
      description: this.description,
      grade: this.grade ?? null,
      lastProgressed: this.lastProgressed ?? null,
      timeSpent: this.timeSpent ?? 0,
      isComplete: this.isComplete ?? false,
      priority: this.priority ?? null,
      createdAt: this.createdAt ?? new Date(),
      lastUpdatedAt: this.lastUpdatedAt ?? new Date(),
    };
  }

  // --- Getters & Setters ---
  get taskId(): string | null {
    return this._taskId ?? null;
  }
  set taskId(val: string | null | undefined) {
    this._taskId = val ?? null;
  }

  get userId(): string {
    return this._userId;
  }
  set userId(val: string) {
    if (!val) throw new Error("userId required");
    this._userId = val;
  }

  get title(): string {
    return this._title;
  }
  set title(val: string) {
    if (!val) throw new Error("title required");
    this._title = val;
  }

  get courseId(): string {
    return this._courseId;
  }
  set courseId(val: string) {
    if (!val) throw new Error("courseId required");
    this._courseId = val;
  }

  get weight(): number {
    return this._weight;
  }
  set weight(val: number) {
    if (typeof val !== "number" || val < 0 || val > 1)
      throw new Error("weight must be 0-1");
    this._weight = val;
  }

  get dueDate(): Date {
    return this._dueDate;
  }
  set dueDate(val: Date) {
    if (!(val instanceof Date)) throw new Error("dueDate must be a Date");
    this._dueDate = val;
  }

  get description(): string | undefined {
    return this._description;
  }
  set description(val: string | undefined) {
    this._description = val;
  }

  get grade(): number | null | undefined {
    return this._grade;
  }
  set grade(val: number | null | undefined) {
    this._grade = val ?? null;
  }

  get lastProgressed(): Date | null | undefined {
    return this._lastProgressed;
  }
  set lastProgressed(val: Date | null | undefined) {
    this._lastProgressed = val ?? null;
  }

  get timeSpent(): number {
    return this._timeSpent;
  }
  set timeSpent(val: number) {
    this._timeSpent = val;
  }

  get isComplete(): boolean {
    return this._isComplete;
  }
  set isComplete(val: boolean) {
    this._isComplete = val;
  }

  get priority(): number | null | undefined {
    return this._priority;
  }
  set priority(val: number | null | undefined) {
    this._priority = val ?? null;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
  set createdAt(val: Date) {
    this._createdAt = val;
  }

  get lastUpdatedAt(): Date {
    return this._lastUpdatedAt;
  }
  set lastUpdatedAt(val: Date) {
    this._lastUpdatedAt = val;
  }

  static fromJson(json: Task): TaskModel {
    return new TaskModel({
      taskId: json.taskId ?? null,
      userId: json.userId,
      title: json.title,
      courseId: json.courseId,
      weight: json.weight,
      dueDate:
        json.dueDate instanceof Date ? json.dueDate : new Date(json.dueDate),
      description: json.description,
      grade: json.grade ?? null,
      lastProgressed: json.lastProgressed
        ? new Date(json.lastProgressed)
        : null,
      timeSpent: json.timeSpent ?? 0,
      isComplete: json.isComplete ?? false,
      priority: json.priority ?? null,
      createdAt: json.createdAt ? new Date(json.createdAt) : new Date(),
      lastUpdatedAt: json.lastUpdatedAt
        ? new Date(json.lastUpdatedAt)
        : new Date(),
    });
  }
}
