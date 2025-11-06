const request = require("supertest");
import { expect } from "chai";
import { config } from "dotenv";
import { describe, it } from "node:test";
import { Course, CourseUpdate } from "../src/models/course";
config();
const app = require("../src/index");



describe("Courses API", () => {
  let mockCoursePayload: Course;
  let mockCourseUpdatePayload: CourseUpdate;
  let mockInvalidCourseUpdatePayload: {};
  let mockInvalidTypeCoursePayload: {};
  let validUserId: string;
  let validCourseName: string;
  let invalidUserId: string;
  let invalidCourseName: string;
  before(() => {
    // Runs once before all tests in this block
    validUserId = "user123";
    validCourseName = "course123";
    invalidUserId = "notreal123";
    invalidCourseName = "divincii";
    mockCoursePayload = {
      userId: validUserId,
      courseName: validCourseName
    };
    mockInvalidTypeCoursePayload = {
      userId: 0,
      courseName: 0
    };
    mockCourseUpdatePayload = {
      courseName: "course111"
    };
    mockInvalidCourseUpdatePayload = {
      courseName: 0
    };
  });

  beforeEach(() => {
    async () => {
      const response = await request(app)
        .post("/tasks")
        .send(mockTaskPayload)
        .expect(200);
      validTaskId = response.body.task.id; // capture the real generated id
    };
  });

  afterEach(() => {
    async () => {
      await request(app)
        .delete(`/tasks/${validUserId}?taskId=${validTaskId}`)
        .expect(200);
    };
  });

  // --- CREATE ---
  describe("POST /tasks", () => {
    it("should create a task with valid payload", async () => {
      const response = await request(app)
        .post("/tasks")
        .send(mockTaskPayload)
        .expect(200);
      expect(response.body).to.have.property("task");
      const { task } = response.body;
      expect(task).to.include({
        userId: validUserId,
        title: mockTaskPayload.title,
        courseId: mockTaskPayload.courseId,
        weight: mockTaskPayload.weight,
        description: mockTaskPayload.description,
        isComplete: mockTaskPayload.isComplete,
        priority: mockTaskPayload.priority,
      });
    });
    it("should fail when required fields are missing", async () => {
      await request(app).post("/tasks").send({}).expect(400);
    });
    it("should fail when fields have invalid types", async () => {
      await request(app)
        .post("/tasks")
        .send(mockInvalidTypeTaskPayload)
        .expect(400);
    });
  });

  // --- READ ---
  describe("GET /tasks/:userId?:taskId", () => {
    it("should return all tasks for a user", async () => {
      const response = await request(app)
        .get(`/tasks/${validUserId}`)
        .expect(200);
      expect(response.body).to.have.property("task");
      const { task } = response.body;
      for (const t of task) {
        checkTaskFormatFromResponse(t);
      }
    });
    it("should return 404 for non-existent user id", async () => {
      await request(app).get(`/tasks/${invalidUserId}`).expect(404);
    });
    it("should return a single task when taskId query param is provided", async () => {
      const response = await request(app)
        .get(`/tasks/${validUserId}`)
        .query({ taskId: validTaskId })
        .expect(200);

      expect(response.body).to.have.property("task");
      const task = response.body.task;
      checkTaskFormatFromResponse(task);
    });

    it("should return 404 if taskId does not exist", async () => {
      await request(app)
        .get(`/tasks/${validUserId}`)
        .query({ taskId: invalidTaskId })
        .expect(404);
    });
  });

  // --- UPDATE ---
  describe("PUT /tasks/:userId?:taskId", () => {
    it("should update a task with valid payload", async () => {
      const response = await request(app)
        .put(`/tasks/${validUserId}?taskId=${validTaskId}`)
        .send(mockTaskUpdatePayload)
        .expect(200);
      const updatedTask = response.body.task;
      expect(updatedTask).to.have.property(
        "description",
        mockTaskUpdatePayload.description
      );
      expect(updatedTask).to.have.property(
        "grade",
        mockTaskUpdatePayload.grade
      );
      expect(updatedTask).to.have.property(
        "lastProgressed",
        mockTaskUpdatePayload.lastProgressed
      );
      expect(updatedTask).to.have.property(
        "timeSpent",
        mockTaskUpdatePayload.timeSpent
      );
      expect(updatedTask).to.have.property(
        "isComplete",
        mockTaskUpdatePayload.isComplete
      );
      expect(updatedTask).to.have.property(
        "priority",
        mockTaskUpdatePayload.priority
      );
      expect(new Date(updatedTask.createdAt).toString()).to.not.equal(
        "Invalid Date"
      );
      expect(new Date(updatedTask.lastUpdatedAt).toString()).to.not.equal(
        "Invalid Date"
      );
      expect(updatedTask.description).to.be.a("string");
      expect(
        updatedTask.grade === null || typeof updatedTask.grade === "number"
      ).to.be.true;
      expect(
        updatedTask.lastProgressed === null ||
          !isNaN(new Date(updatedTask.lastProgressed).getTime())
      ).to.be.true;
      expect(updatedTask.timeSpent).to.be.a("number");
      expect(updatedTask.isComplete).to.be.a("boolean");
      expect(updatedTask.priority).to.be.a("number");
    });
  });
  it("should fail for invalid user id", async () => {
    await request(app)
      .put(`/tasks/${invalidUserId}?taskId=${validTaskId}`)
      .send(mockTaskUpdatePayload)
      .expect(404);
  });
  it("should fail for invalid task id", async () => {
    await request(app)
      .put(`/tasks/${validUserId}?taskId=${invalidTaskId}`)
      .send(mockTaskUpdatePayload)
      .expect(404);
  });
  it("should fail for invalid field types", async () => {
    await request(app)
      .put(`/tasks/${validUserId}?taskId=${validTaskId}`)
      .send(mockInvalidTaskUpdatePayload)
      .expect(400);
  });

  // --- DELETE ---
  describe("DELETE /tasks/:userId?:taskId", () => {
    it("should delete a task with valid id", async () => {
      await request(app)
        .delete(`/tasks/${validUserId}?taskId=${validTaskId}`)
        .expect(200);
    });
    it("should fail for invalid user id", async () => {
      await request(app)
        .delete(`/tasks/${invalidUserId}?taskId=${validTaskId}`)
        .expect(404);
    });
    it("should fail for invalid task id", async () => {
      await request(app)
        .delete(`/tasks/${validUserId}?taskId=${invalidTaskId}`)
        .expect(404);
    });
  });
});