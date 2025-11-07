# Repositories Layer Docs

## What is the Repositories Layer?

The **Repositories Layer**:

- Handles **data access** and interactions with the database (Firestore in this project).
- Provides **CRUD operations** for tasks and courses.
- Abstracts away database-specific logic from controllers and services.
- Should not perform request validation; assume the input is already validated.

---

## Task Repository (`taskRepo`)

### Functions

- `createTask(task: Task): Promise<Task>`

  - Inserts a new task into Firestore.
  - Returns the created task including `taskId`.

- `getAllUserTasks(userId: string, courseId?: string | null): Promise<Task[]>`

  - Retrieves all tasks for a user.
  - Can filter by `courseId`.

- `getSingleUserTask(userId: string, taskId: string): Promise<Task>`

  - Retrieves a single task by ID.
  - Checks that the user owns the task.

- `updateTask(userId: string, taskId: string, taskPayload: Task): Promise<void>`

  - Updates task fields in Firestore.
  - Does not allow updating `userId` or `taskId`.

- `deleteTask(userId: string, taskId: string): Promise<void>`

  - Deletes a task by ID.
  - Checks that the user owns the task.

---

## Course Repository (`courseRepo`)

### Functions

- `createCourse(course: Course): Promise<Course>`

  - Inserts a new course into Firestore.
  - Returns the created course including `courseId`.

- `getAllCourses(userId: string): Promise<Course[]>`

  - Retrieves all courses for a user.

- `getSingleCourse(userId: string, courseId: string): Promise<Course>`

  - Retrieves a single course by ID.
  - Checks that the user owns the course.

- `updateCourse(userId: string, courseId: string, data: CourseUpdate): Promise<void>`

  - Updates course fields in Firestore.
  - Checks that the user owns the course.

- `deleteCourse(userId: string, courseId: string): Promise<void>`

  - Deletes a course by ID.
  - Checks that the user owns the course.

---

## Key Points

- Repositories should **never perform complex validation**; controllers handle that.
- Repositories interact directly with Firestore.
- Always check **ownership** before updating or deleting.
- Returns domain objects in a consistent format for the controllers/services.
- Keeps database code **centralized** and decoupled from the rest of the app.
