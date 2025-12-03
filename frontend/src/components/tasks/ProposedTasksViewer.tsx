import { useState, useEffect, useCallback } from "react";

import { LoadingSpinner } from "../LoadingSpinner";
import { TabsView } from "../TabsView";

import { getProposedCourseInfo } from "../../services/llmService";
import type { Course } from "../../../../shared/models/course";
import type { Task } from "../../../../shared/models/task";
import { createCourse } from "../../services/coursesService";
import { createTask } from "../../services/tasksService";
import { useAuth } from "../../hooks/useAuth";
import { CourseForm } from "./CourseForm";
import { TaskForm } from "./TaskForm";

interface ProposedTaskViewerProps {
  document: string;
}

export function ProposedTasksViewer({ document }: ProposedTaskViewerProps) {
  const { uid } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [proposedCourse, setProposedCourse] = useState<Course | null>(null);
  const [proposedTasks, setProposedTasks] = useState<Task[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [courseFormPayload, setCourseFormPayload] = useState<Course | null>(
    null
  );
  const [taskFormsPayloads, setTaskFormsPayloads] = useState<Task[]>([]);

  useEffect(() => {
  if (proposedTasks) {
    setTaskFormsPayloads(proposedTasks);
  }
}, [proposedTasks]);

const handleTaskChange = useCallback((index: number, updated: Task) => {
  setTaskFormsPayloads((prev) => {
    const copy = [...prev];
    copy[index] = updated;
    return copy;
  });
}, []);

  const loadProposedInfo = useCallback(async () => {
    setIsLoading(true);

    try {
      const { course, tasks, error } = await getProposedCourseInfo(document);
      console.log(`Course: ${JSON.stringify(course, null, 2)}`);
      console.log(`Tasks: ${JSON.stringify(tasks, null, 2)}`);
      setProposedCourse(course);
      setProposedTasks(tasks ?? []);
      if (error) setErrorMessage(error);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [document]);

  useEffect(() => {
    if (document) loadProposedInfo();
  }, [document, loadProposedInfo]);

  const handleSubmitAll = async () => {
    if (!courseFormPayload) {
      console.log("No course data to submit.");
      return;
    }

    try {
      // Create Course
      const createdCourse = await createCourse({...courseFormPayload, userId: uid!, currentGrade: 0});
      console.log(`Created course: ${JSON.stringify(createdCourse, null, 2)}`);

      // Create all tasks
      await Promise.all(
        taskFormsPayloads.map((t) =>
          createTask({
            ...t,
            courseId: createdCourse.courseId!,
            userId: uid!,
            createdAt: new Date() ,
            lastUpdatedAt: new Date(),
          })
        )
      );

      alert("Course and tasks created!");
      loadProposedInfo();
    } catch (err) {
      console.error("Failed to submit all:", err);
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
                course={proposedCourse}
                onChange={setCourseFormPayload}
              />
            ),
          },
          {
            label: "Tasks",
            value: "tasks",
            content: (
              <div>
                {proposedTasks.map((task, i) => (
                  <TaskForm
                    key={i}
                    task={task}
                    course={courseFormPayload ?? proposedCourse ?? null}
                    onChange={(t) => handleTaskChange(i, t)
                      
                    }
                  />
                ))}
              </div>
            ),
          },
        ]}
      />

      <div style={{ marginTop: "1rem", textAlign: "right" }}>
        <button onClick={handleSubmitAll}>Submit Course & Tasks</button>
      </div>
    </div>
  );
}
