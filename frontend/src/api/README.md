# API Layer Docs

## What is the API Layer?

The **API Layer** serves as the bridge between the **service layer** and the **controllers/routes**. It is responsible for:

- Exposing **HTTP endpoints** that the frontend can call.
- Receiving requests and passing them to the appropriate **service/controller** functions.
- Handling response status codes and formatting responses consistently.
- Performing lightweight request validation, such as ensuring required parameters exist.

In this project, the API layer is primarily implemented using **Express** with controllers for **tasks** and **courses**.

---

## Tasks API

### Endpoints

#### `POST /api/tasks/`

- **Description**: Creates a new task for a user.
- **Request Body**: `Task` object with required fields: `userId`, `title`, `courseId`.
- **Response**:

  - `200 OK` – Successfully created task, returns task object including `taskId`.
  - `400 Bad Request` – Invalid payload or failed validation.

#### `GET /api/tasks/:userId`

- **Description**: Retrieves tasks for a specific user.
- **Query Parameters**:

  - `taskId` – optional, fetch a specific task.
  - `courseId` – optional, filter tasks by course.

- **Response**:

  - `200 OK` – Array of task objects.
  - `404 Not Found` – No tasks found or user not authorized.
  - `400 Bad Request` – Other errors.

#### `PUT /api/tasks/`

- **Description**: Updates an existing task.
- **Request Body**: `{ userId, taskId, taskPayload }`.
- **Response**:

  - `200 OK` – Task successfully updated.
  - `400 Bad Request` – Invalid payload or attempting to update immutable fields (`userId` or `taskId`).

#### `DELETE /api/tasks/:userId/:taskId`

- **Description**: Deletes a task for a user.
- **Response**:

  - `200 OK` – Task successfully deleted.
  - `400 Bad Request` – Failed deletion.

---

## Courses API

### Endpoints

#### `POST /api/courses/`

- **Description**: Creates a new course for a user.
- **Request Body**: `Course` object with required fields: `userId`, `courseName`.
- **Response**:

  - `201 Created` – Returns newly created course object including `courseId`.
  - `400 Bad Request` – Invalid payload or error creating course.

#### `GET /api/courses/:userId`

- **Description**: Retrieves courses for a user.
- **Query Parameters**:

  - `courseId` – optional, fetch a specific course.

- **Response**:

  - `200 OK` – Array of course objects.
  - `400 Bad Request` – Failed retrieval.

#### `PUT /api/courses/`

- **Description**: Updates an existing course.
- **Request Body**: `{ userId, courseId, coursePayload }`.
- **Response**:

  - `200 OK` – Course successfully updated.
  - `400 Bad Request` – Failed update.

#### `DELETE /api/courses/:userId/:courseId`

- **Description**: Deletes a course for a user.
- **Response**:

  - `200 OK` – Course successfully deleted.
  - `400 Bad Request` – Failed deletion.

---

## Key Points

- Controllers in the API layer handle **input validation**, **error catching**, and formatting responses.
- All endpoints return **JSON** objects with `message` fields and relevant data.
- The API layer should remain **thin**, delegating most business logic to the **service layer**.
- **Status codes** are used consistently to indicate success (`200`, `201`) or failure (`400`, `404`).
- `index.ts` is where all file imports go for easier method retrieval from external directories

---

## Best Practices

1. Validate request payloads before calling service functions.
2. Catch and log errors consistently, returning meaningful messages to the client.
3. Keep the API layer decoupled from the database; repositories/services handle data access.
4. Ensure endpoint URLs follow **RESTful conventions**.
5. Use consistent response structures for easier frontend integration.
