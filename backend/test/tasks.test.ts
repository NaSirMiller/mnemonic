const fs = require("fs");
const path = require("path");
const request = require("supertest");
import { expect } from "chai";
import { config } from "dotenv";
import { describe, it } from "node:test";
import { Task, TaskUpdate, TaskModel } from "../src/models/task";
config();
const app = require("../src/index");

function checkTaskFormatFromResponse(t: Record<string, unknown>): void {
  expect(t).to.have.property("userId").that.is.a("string");
  expect(t).to.have.property("title").that.is.a("string");
  expect(t).to.have.property("courseId").that.is.a("string");
  expect(t).to.have.property("weight").that.is.a("number");
  expect(t.weight as number).to.be.within(0, 1);

  // Validate dates safely using type assertion
  expect(t).to.have.property("dueDate");
  expect(!isNaN(new Date(t.dueDate as string | number | Date).getTime())).to.be
    .true;

  expect(t).to.have.property("description");
  expect(t.description).to.satisfy(
    (v: unknown) => typeof v === "string" || v === undefined
  );

  expect(t).to.have.property("grade");
  expect(t.grade).to.satisfy(
    (v: unknown) => typeof v === "number" || v === null || v === undefined
  );

  expect(t).to.have.property("lastProgressed");
  const lastProgressed = t.lastProgressed as
    | string
    | number
    | Date
    | null
    | undefined;
  if (lastProgressed !== null && lastProgressed !== undefined) {
    expect(!isNaN(new Date(lastProgressed).getTime())).to.be.true;
  }

  expect(t).to.have.property("timeSpent").that.is.a("number");
  expect(t).to.have.property("isComplete").that.is.a("boolean");

  expect(t).to.have.property("priority");
  expect(t.priority).to.satisfy(
    (v: unknown) => typeof v === "number" || v === null || v === undefined
  );

  expect(t).to.have.property("createdAt");
  expect(!isNaN(new Date(t.createdAt as string | number | Date).getTime())).to
    .be.true;

  expect(t).to.have.property("lastUpdatedAt");
  expect(!isNaN(new Date(t.lastUpdatedAt as string | number | Date).getTime()))
    .to.be.true;
}

describe("Tasks API", () => {
  let mockTaskPayload: Task;
  let mockTaskUpdatePayload: TaskUpdate;
  let mockMissingRequiredFieldPayload: {};
  let mockInvalidTaskUpdatePayload: {};
  let mockInvalidTypeTaskPayload: {};
  let validTaskId: string;
  let validUserId: string;
  let invalidUserId: string;
  let invalidTaskId: string;
  before(() => {
    // Runs once before all tests in this block
    validUserId = "user123";
    validTaskId = "task123";
    invalidUserId = "notreal123";
    invalidTaskId = "divincii";
    mockTaskPayload = {
      userId: validUserId,
      title: "Finish Homework 1",
      courseId: "CS101",
      weight: 0.5,
      dueDate: new Date("2025-11-01T23:59:59Z"),
      description: "Chapter 3 exercises",
      grade: null,
      lastProgressed: null,
      timeSpent: 0,
      isComplete: false,
      priority: 1,
      createdAt: new Date(),
      lastUpdatedAt: new Date(),
    };
    mockMissingRequiredFieldPayload = {};
    mockInvalidTypeTaskPayload = {
      userId: 0,
      title: 0,
      courseId: 0,
      weight: "high",
      dueDate: 2002,
      description: 24,
      grade: "grade",
      lastProgressed: "progress",
      timeSpent: "time",
      isComplete: "no",
      priority: "no",
      createdAt: 2022,
      lastUpdatedAt: 2024,
    };
    mockTaskUpdatePayload = {
      description: "Chapter 3 exercises",
      grade: null,
      lastProgressed: null,
      timeSpent: 0,
      isComplete: false,
      priority: 1,
      createdAt: new Date(),
      lastUpdatedAt: new Date(),
    };
    mockInvalidTaskUpdatePayload = {
      description: 0,
      grade: "no",
      lastProgressed: "no",
      timeSpent: "no",
      isComplete: 2,
      priority: "fove",
      createdAt: 1,
      lastUpdatedAt: 1,
    };
  });

  beforeEach(() => {
    // Runs before each individual test
    console.log("Seed DB with test data");
  });

  afterEach(() => {
    // Runs after each individual test
    console.log("Clean up DB changes");
  });

  after(() => {
    // Runs once after all tests in this block
    console.log("Close DB connection");
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
  describe("PUT /tasks/:id", () => {
    it("should update a task with valid payload", () => {});
    it("should fail for invalid id", () => {});
    it("should fail for invalid field types", () => {});
  });

  // --- DELETE ---
  describe("DELETE /tasks/:id", () => {
    it("should delete a task with valid id", () => {});
    it("should fail for non-existent id", () => {});
  });
});
