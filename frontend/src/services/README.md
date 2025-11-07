# Service Layer Docs

## What is the Service Layer?

The **Service Layer** acts as an abstraction between your **frontend components** and the **backend API/repositories**. It is responsible for:

- Fetching data from backend endpoints.
- Formatting and normalizing data for frontend consumption.
- Handling errors or exceptions before data reaches the UI.
- Maintaining a clean separation between the UI and backend logic.

In this project, the service layer provides functions to interact with **tasks** and **courses**, typically calling backend APIs via `fetch`.

---

## Tasks Service (`tasksService.ts`)

### Functions

#### `getTasks(userId: string, taskId?: string | null, courseId?: string | null)`

- **Description**: Retrieves tasks for a specific user, optionally filtered by task ID or course ID.
- **Parameters**:

  - `userId` – the user's unique ID.
  - `taskId` – optional ID to retrieve a single task.
  - `courseId` – optional course ID to filter tasks by course.

- **Returns**: `Promise<Task[]>` – an array of task objects.

#### Example Usage

```ts
const tasks = await getTasks(uid, null, selectedCourseId);
```

---

## Courses Service (`coursesService.ts`)

### Functions

#### `getCourses(userId: string, courseId?: string | null)`

- **Description**: Fetches courses for a user, optionally filtered by course ID.
- **Parameters**:

  - `userId` – the user's unique ID.
  - `courseId` – optional course ID to fetch a single course.

- **Returns**: `Promise<Course[]>` – an array of course objects.

#### `createCourse(course: Course)`

- **Description**: Sends a request to create a new course in the backend.
- **Parameters**:

  - `course` – a `Course` object containing the course details (excluding auto-generated `courseId`).

- **Returns**: `Promise<Course>` – the newly created course object with generated `courseId`.

#### Example Usage

```ts
const newCourse = await createCourse({
  userId: uid,
  courseName: "CS101",
  currentGrade: 0,
});
```

---

## Key Points

- The service layer **does not validate data types**; validation is handled either in the **controller** or **utility functions**.
- All service functions return **Promises**, allowing the frontend to `await` the results.
- Centralizing API calls in the service layer simplifies **error handling** and **data normalization** for the frontend.

---

## Best Practices

1. Keep services thin: they should mainly handle API calls, not business logic.
2. Normalize/format data here if necessary (e.g., converting timestamps to `Date` objects).
3. Always handle errors and throw them to the calling component for UI feedback.
4. Avoid duplicating API endpoints in multiple services; reuse the service functions wherever needed.
