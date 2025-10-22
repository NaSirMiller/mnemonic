import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from "@firebase/rules-unit-testing";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
const fs = require("fs");
const path = require("path");
import { config } from "dotenv";
config();

let testEnv;

const projectId = process.env.FIREBASE_PROJECT_ID!;
const rulesPath = path.join(__dirname, "../../../firestore.rules");
const rules = fs.readFileSync(rulesPath, "utf8");

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: projectId,
    firestore: {
      rules: rules,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe("Firestore Security Rules", () => {
  const userId = "user_123";
  const otherUserId = "user_456";

  const validCourse = { userId, courseName: "Math 101" };
  const invalidCourse = { userId: 123 }; // missing course name

  const validAssignment = {
    userId,
    title: "Homework 1",
    courseId: "course_1",
    weight: 0.2,
    dueDate: new Date(),
    description: "Do exercises 1-5",
    grade: null,
  };

  const validTask = {
    userId,
    title: "Task 1",
    description: "Complete task",
    isComplete: false,
    assignmentId: null,
    dueDate: new Date(),
    lastProgressed: null,
    timeSpent: 30,
    priority: 1,
  };

  // ─── Courses ──────────────────────────────
  describe("/courses rules", () => {
    test("unauthenticated cannot read", async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      const ref = doc(db, "courses/course1");
      await assertFails(getDoc(ref));
    });

    test("authenticated can create valid course", async () => {
      const db = testEnv.authenticatedContext(userId).firestore();
      const ref = doc(db, "courses/course1");
      await assertSucceeds(setDoc(ref, validCourse));
    });

    test("cannot create invalid course", async () => {
      const db = testEnv.authenticatedContext(userId).firestore();
      const ref = doc(db, "courses/course2");
      await assertFails(setDoc(ref, invalidCourse));
    });

    test("user cannot update another user course", async () => {
      const db = testEnv.authenticatedContext(otherUserId).firestore();
      const ref = doc(db, "courses/course1");
      await assertFails(updateDoc(ref, { courseName: "Physics" }));
    });
  });

  // ─── Assignments ──────────────────────────────
  describe("/assignments rules", () => {
    test("authenticated can create valid assignment", async () => {
      const db = testEnv.authenticatedContext(userId).firestore();
      const ref = doc(db, "assignments/assignment1");
      await assertSucceeds(setDoc(ref, validAssignment));
    });

    test("user cannot read another user's assignment", async () => {
      const db = testEnv.authenticatedContext(otherUserId).firestore();
      const ref = doc(db, "assignments/assignment1");
      await assertFails(getDoc(ref));
    });

    test("owner can update assignment", async () => {
      const db = testEnv.authenticatedContext(userId).firestore();
      const ref = doc(db, "assignments/assignment1");
      await assertSucceeds(updateDoc(ref, { title: "Updated Homework" }));
    });

    test("other user cannot delete assignment", async () => {
      const db = testEnv.authenticatedContext(otherUserId).firestore();
      const ref = doc(db, "assignments/assignment1");
      await assertFails(deleteDoc(ref));
    });
  });

  // ─── Tasks ──────────────────────────────
  describe("/tasks rules", () => {
    test("authenticated can create valid task", async () => {
      const db = testEnv.authenticatedContext(userId).firestore();
      const ref = doc(db, "tasks/task1");
      await assertSucceeds(setDoc(ref, validTask));
    });

    test("owner can read task", async () => {
      const db = testEnv.authenticatedContext(userId).firestore();
      const ref = doc(db, "tasks/task1");
      await assertSucceeds(getDoc(ref));
    });

    test("other user cannot update task", async () => {
      const db = testEnv.authenticatedContext(otherUserId).firestore();
      const ref = doc(db, "tasks/task1");
      await assertFails(updateDoc(ref, { title: "Hack" }));
    });

    test("owner can delete task", async () => {
      const db = testEnv.authenticatedContext(userId).firestore();
      const ref = doc(db, "tasks/task1");
      await assertSucceeds(deleteDoc(ref));
    });
  });
});
