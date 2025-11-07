# Controllers Layer Docs

## What is the Controllers Layer?

The **Controllers Layer**:

- Receives requests from the **routes layer**.
- Performs **input validation**, formatting, and type checks.
- Calls the appropriate **service/repository functions**.
- Handles errors and returns **consistent JSON responses**.

---

## Task Controllers

### `createUserTask(request, response)`

- Creates a new task for a user.
- Validates required fields (`userId`, `title`, `courseId`).
- Validates types and numeric field constraints (`weight`, `priority`, `grade`).
- Normalizes dates and applies defaults.
- Calls `taskRepo.createTask()`.

### `getUserTasks(request, response)`

- Retrieves tasks for a user.
- Accepts optional query parameters `taskId` and `courseId`.
- Calls `taskRepo.getAllUserTasks()` or `taskRepo.getSingleUserTask()`.

### `updateUserTask(request, response)`

- Updates an existing task.
- Checks immutable fields (`taskId` and `userId`) are not updated.
- Validates types and numeric fields.
- Calls `taskRepo.updateTask()`.

### `deleteUserTask(request, response)`

- Deletes a task for a user.
- Calls `taskRepo.deleteTask()`.

---

## Course Controllers

### `createCourse(request, response)`

- Creates a new course for a user.
- Calls `courseRepo.createCourse()`.

### `getCourse(request, response)`

- Retrieves courses for a user.
- Accepts optional query parameter `courseId`.
- Calls `courseRepo.getAllCourses()` or `courseRepo.getSingleCourse()`.

### `updateCourse(request, response)`

- Updates a course.
- Calls `courseRepo.updateCourse()`.

### `deleteCourse(request, response)`

- Deletes a course for a user.
- Calls `courseRepo.deleteCourse()`.

---

## Key Points

- Controllers handle **all validation**, including types, required fields, and immutable checks.
- They catch errors and send proper **HTTP status codes** and **error messages**.
- Controllers never access the database directly; they call **repositories/services**.
- Keep controllers focused on request/response logic, not business logic.
