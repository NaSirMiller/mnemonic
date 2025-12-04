import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LoadingSpinner } from "../general/LoadingSpinner";
import { TabsView } from "../general/TabsView";

import { getProposedCourseInfo } from "../../services/llmService";
import { createCourseWithTasks } from "../../services/courseWithTasksService";
import type { Course } from "../../../../shared/models/course";
import type { Task } from "../../../../shared/models/task";
import { useAuth } from "../../hooks/useAuth";
import { CourseForm } from "./forms/CourseForm";
import { TaskForm } from "./forms/TaskForm";
import { Carousel } from "../general/Carousel/Carousel";
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
        if (error) {
          setErrorMessage(error);
          toast.error(error);
        }
        setProposedCourse(course ? { ...course, userId: uid! } : null);
        setCourseFormPayload(course ? { ...course, userId: uid! } : null);
        setProposedTasks(tasks ?? []);
        setTaskFormsPayloads(tasks ?? []);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [document, uid, useMock]);

  useEffect(() => {
    if (document || useMock) loadProposedInfo();
  }, [document, loadProposedInfo, useMock]);

  const handleSubmitSuggested = async () => {
    if (!courseFormPayload || taskFormsPayloads.length === 0) {
      toast.warn("No course or tasks data to submit.");
      return;
    }

    try {
      const validTasks = taskFormsPayloads.map((t) => ({
        ...t,
        title: t.title,
        userId: uid!,
        currentTime: 0,
        grade: 0,
        isComplete: false,
        dueDate:
          t.dueDate && !isNaN(new Date(t.dueDate).getTime())
            ? new Date(t.dueDate)
            : null,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      }));

      const { course, tasks } = await createCourseWithTasks(
        courseFormPayload,
        validTasks
      );

      console.log(`Created Course: ${JSON.stringify(course, null, 2)}`);
      console.log(`Created Tasks: ${JSON.stringify(tasks, null, 2)}`);

      toast.success("Course and tasks created successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1 second delay
    } catch (err) {
      console.error("Failed to submit proposed course and tasks:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to create course and tasks.";
      toast.error(msg);
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
                      onRemove={() =>
                        setTaskFormsPayloads((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
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
          onClick={handleSubmitSuggested}
        >
          Submit Course & Tasks
        </button>
      </div>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
}
