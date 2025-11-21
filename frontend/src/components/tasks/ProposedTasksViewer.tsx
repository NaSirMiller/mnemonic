import { useEffect } from "react";

import { useProposedCoursesAndTasks } from "../../hooks/useProposedCoursesAndTasks";
import { useAuth } from "../../hooks/useAuth";

import { CourseListForm } from "./CourseListForm";
import { LoadingSpinner } from "../LoadingSpinner";
import { TabsView } from "../TabsView";
import { TaskListForm } from "./TaskListForm";
import type { Course } from "../../../../shared/models/course";
import { useState } from "react";
import type { Task } from "../../../../shared/models/task";

interface ProposedTaskViewerProps {
  document: string;
  onSubmitCourse: (course: Course) => Promise<void>;
  onSubmitTasks: (tasks: Task[]) => Promise<void>;
  onAllSubmitted: () => void;
}
export function ProposedTasksViewer({
  document,
  onSubmitCourse,
  onSubmitTasks,
  onAllSubmitted,
}: ProposedTaskViewerProps) {
  const { uid } = useAuth();
  const {
    isLoading,
    course: proposedCourse,
    tasks: proposedTasks,
    error,
    refresh,
  } = useProposedCoursesAndTasks(document);

  const [course, setCourse] = useState<Course | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setCourse(proposedCourse);
  }, [proposedCourse]);

  useEffect(() => {
    setTasks(proposedTasks || []);
  }, [proposedTasks]);

  // Called from TaskPage's Submit All button or form actions
  const handleSubmitAll = async () => {
    if (course) {
      await onSubmitCourse(course);
    }

    if (tasks.length > 0) {
      await onSubmitTasks(tasks);
    }

    onAllSubmitted();
  };

  if (error) return <div>{error}</div>;
  if (isLoading || !course || !tasks) return <LoadingSpinner />;

  return (
    <div className="proposed-tasks-viewer">
      <TabsView
        initial="courses"
        tabs={[
          {
            label: "Courses",
            value: "courses",
            content: (
              <CourseListForm
                userId={uid!}
                selectedCourse={course}
                setSelectedCourse={setCourse}
                onCoursesChanged={() => refresh?.()}
              />
            ),
          },
          {
            label: "Tasks",
            value: "tasks",
            content: (
              <TaskListForm
                userId={uid!}
                tasks={tasks}
                selectedCourse={course!}
                onTasksChanged={() => refresh?.()}
              />
            ),
          },
        ]}
      />

      <div className="submit-all-btn" onClick={handleSubmitAll}>
        Submit All
      </div>
    </div>
  );
}
