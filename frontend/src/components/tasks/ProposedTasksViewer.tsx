import { useState, useEffect } from "react";

import EditTask from "../../components/tasks/EditTask/EditTask";
import EditCourse from "../../components/tasks/EditCourse/EditCourse";
import { LoadingSpinner } from "../LoadingSpinner";
import { TabsView } from "../TabsView";

import { getProposedCourseInfo } from "../../services/llmService";
import type { Course } from "../../../../shared/models/course";
import type { Task } from "../../../../shared/models/task";

interface ProposedTaskViewerProps {
  document: string;
}

export function ProposedTasksViewer({ document }: ProposedTaskViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [proposedCourses, setProposedCourses] = useState<Course[] | null>(null);
  const [proposedTasks, setProposedTasks] = useState<Task[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadProposedInfo() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { courses, tasks } = await getProposedCourseInfo(document);

      setProposedCourses(courses);
      setProposedTasks(tasks);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (document) loadProposedInfo();
  }, [document]);

  if (errorMessage) return <div>{errorMessage}</div>;
  if (isLoading || !proposedCourses || !proposedTasks)
    return <LoadingSpinner />;

  return (
    <TabsView
      initial="courses"
      tabs={[
        {
          label: "Courses",
          value: "courses",
          content: <EditCourse onCoursesChanged={loadProposedInfo} />,
        },
        {
          label: "Tasks",
          value: "tasks",
          content: <EditTask onTasksChanged={loadProposedInfo} />,
        },
        {
          label: "Debug",
          value: "debug",
          content: (
            <pre>
              {JSON.stringify({ proposedCourses, proposedTasks }, null, 2)}
            </pre>
          ),
        },
      ]}
    />
  );
}
