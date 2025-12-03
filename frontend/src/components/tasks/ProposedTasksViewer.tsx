import { useState, useEffect, useCallback } from "react";

import { LoadingSpinner } from "../LoadingSpinner";
import { TabsView } from "../TabsView";

import { getProposedCourseInfo } from "../../services/llmService";
import type { Course } from "../../../../shared/models/course";
import type { Task } from "../../../../shared/models/task";
import { createCourse } from "../../services/coursesService";
import { createTask } from "../../services/tasksService";
import { useAuth } from "../../hooks/useAuth";
import { CourseForm } from "./forms/CourseForm";
import { TaskForm } from "./forms/TaskForm";
import { Carousel } from "../Carousel";
import "./ProposedTaskViewer.css";

// Mock data for UI development
const mockCourse: Course = {
  courseId: "mock-course-1",
  courseName: "Sample Course",
  currentGrade: 0,
  gradeTypes: { "Test 1": 0.2, "Test 2": 0.2, Final: 0.6 },
  userId: "mock-user",
};

const mockTasks: Task[] = [
  {
    title: "Test 1",
    gradeType: "Test 1",
    dueDate: new Date(),
    currentTime: 0,
    expectedTime: 1,
    grade: 0,
    courseId: mockCourse.courseId,
    userId: "mock-user",
    priority: 0,
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
  },
  {
    title: "Final",
    gradeType: "Final",
    dueDate: new Date(),
    currentTime: 0,
    expectedTime: 3,
    grade: 0,
    courseId: mockCourse.courseId,
    userId: "mock-user",
    priority: 0,
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
  },
];

interface ProposedTaskViewerProps {
  document: string;
  useMock?: boolean; // new prop for UI development
}

export function ProposedTasksViewer({
  document,
  useMock = false,
}: ProposedTaskViewerProps) {
  const { uid } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [proposedCourse, setProposedCourse] = useState<Course | null>(null);
  const [proposedTasks, setProposedTasks] = useState<Task[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [courseFormPayload, setCourseFormPayload] = useState<Course | null>(
    null
  );
  const [taskFormsPayloads, setTaskFormsPayloads] = useState<Task[]>([]);

  // Load data from API or mock
  const loadProposedInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      if (useMock) {
        setProposedCourse({ ...mockCourse, userId: uid! });
        setCourseFormPayload({ ...mockCourse, userId: uid! });
        setProposedTasks(mockTasks);
        setTaskFormsPayloads(mockTasks);
      } else {
        const { course, tasks, error } = await getProposedCourseInfo(document);
        if (error) setErrorMessage(error);
        setProposedCourse(course ? { ...course, userId: uid! } : null);
        setCourseFormPayload(course ? { ...course, userId: uid! } : null);
        setProposedTasks(tasks ?? []);
        setTaskFormsPayloads(tasks ?? []);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [document, uid, useMock]);

  useEffect(() => {
    if (document || useMock) loadProposedInfo();
  }, [document, loadProposedInfo, useMock]);

  // ACID-style submission: create course, then tasks. If tasks fail, log error.
  const handleSubmitAll = async () => {
    if (!courseFormPayload || taskFormsPayloads.length === 0) {
      console.log("No course or tasks data to submit.");
      return;
    }

    try {
      // 1️⃣ Create Course
      const createdCourse = await createCourse(courseFormPayload);

      // 2️⃣ Prepare tasks with courseId and userId
      const validTasks = taskFormsPayloads.map((t) => ({
        ...t,
        title: t.title || "Untitled Task",
        courseId: createdCourse.courseId,
        userId: uid!,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      }));

      // 3️⃣ Create all tasks
      await Promise.all(validTasks.map((t) => createTask(t)));

      alert("Course and tasks created successfully!");
      loadProposedInfo();
    } catch (err) {
      console.error("Failed to submit all:", err);
      alert("Failed to create course and tasks. See console for details.");
    }
  };

  if (isLoading || !proposedCourse || !proposedTasks) return <LoadingSpinner />;
  if (errorMessage) return <div>{errorMessage}</div>;

  return (
    <div>
      <TabsView
        initial="courses"
        tabs={[
          {
            label: "Courses",
            value: "courses",
            content: (
              <CourseForm
                course={courseFormPayload ?? proposedCourse}
                onChange={setCourseFormPayload}
              />
            ),
          },
          {
            label: "Tasks",
            value: "tasks",
            content: (
              <div>
                <Carousel
                  slidesToShow={1}
                  slidesToScroll={1}
                  infinite={true}
                  dots={true}
                >
                  {taskFormsPayloads.map((task, i) => (
                    <TaskForm
                      key={i}
                      task={task}
                      course={courseFormPayload ?? proposedCourse}
                      onChange={(t) =>
                        setTaskFormsPayloads((prev) => {
                          const copy = [...prev];
                          copy[i] = t;
                          return copy;
                        })
                      }
                    />
                  ))}
                </Carousel>
              </div>
            ),
          },
        ]}
      />

      <div className="submit-course-with-tasks-button-container">
        <button
          className="submit-course-with-tasks-button"
          onClick={handleSubmitAll}
        >
          Submit Course & Tasks
        </button>
      </div>
    </div>
  );
}
