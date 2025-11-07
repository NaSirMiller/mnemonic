# Routes Layer Docs

## What is the Routes Layer?

The **Routes Layer** defines the **HTTP endpoints** that the frontend interacts with and maps them to the corresponding **controller functions**.

- It acts as the entry point for all incoming requests.
- Routes validate URL parameters, query parameters, and HTTP methods.
- It ensures requests reach the correct controller logic.

---

## Task Routes

| Method | Endpoint                     | Description                                                      | Controller       |
| ------ | ---------------------------- | ---------------------------------------------------------------- | ---------------- |
| POST   | `/api/tasks/`                | Create a new task                                                | `createUserTask` |
| GET    | `/api/tasks/:userId`         | Get all tasks for a user (optional `taskId` or `courseId` query) | `getUserTasks`   |
| PUT    | `/api/tasks/`                | Update a task                                                    | `updateUserTask` |
| DELETE | `/api/tasks/:userId/:taskId` | Delete a task                                                    | `deleteUserTask` |

---

## Course Routes

| Method | Endpoint                         | Description                                            | Controller     |
| ------ | -------------------------------- | ------------------------------------------------------ | -------------- |
| POST   | `/api/courses/`                  | Create a new course                                    | `createCourse` |
| GET    | `/api/courses/:userId`           | Get all courses for a user (optional `courseId` query) | `getCourse`    |
| PUT    | `/api/courses/`                  | Update a course                                        | `updateCourse` |
| DELETE | `/api/courses/:userId/:courseId` | Delete a course                                        | `deleteCourse` |

---

## Key Points

- Routes only handle **HTTP method and path mapping**.
- They delegate **business logic** to the corresponding controllers.
- Query and route parameters are parsed and passed to controllers.
- Keep routes **lightweight**; no business logic should live here.
