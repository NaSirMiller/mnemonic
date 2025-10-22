const fs = require("fs");
const path = require("path");
const should = require("should");
const assert = require("assert");
const request = require("supertest");
const app = require("../src/index");

import { config } from "dotenv";
import { describe, it } from "node:test";
config();

describe("Tasks API", () => {
  let mockTask: {};
  before(() => {
    // Runs once before all tests in this block
    console.log("Setup DB connection");
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
    it("should create a task with valid payload", () => {});
    it("should fail when required fields are missing", () => {});
    it("should fail when fields have invalid types", () => {});
  });

  // --- READ ---
  describe("GET /tasks", () => {
    it("should return all tasks", () => {});
  });

  describe("GET /tasks/:id", () => {
    it("should return a single task for valid id", () => {});
    it("should return 404 for non-existent id", () => {});
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
