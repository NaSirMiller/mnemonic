import { useState, useEffect } from "react";
import "./EditTask/EditTask.css";
import type { Task } from "../../../../shared/models/task";
import { createTask, getTasks } from "../../services/tasksService";
import type { Course } from "../../../../shared/models/course";

interface TaskListFormProps {
  userId: string;
  selectedCourse: Course;
  tasks: Task[];
  onTasksChanged?: () => void;
}

export function TaskListForm({
  userId,
  selectedCourse,
  tasks: initialTasks,
  onTasksChanged,
}: TaskListFormProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string>("");

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const updateTaskField = (
    index: number,
    field: keyof Task,
    value: unknown
  ) => {
    setTasks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const submitAllTasks = async (): Promise<Task[] | undefined> => {
    if (!selectedCourse || !selectedCourse.courseId || !userId) return;

    try {
      for (const task of tasks) {
        const weight =
          selectedCourse.gradeTypes && task.gradeType
            ? selectedCourse.gradeTypes[task.gradeType]
            : 0;

        const payload: Task = {
          ...task,
          courseId: selectedCourse.courseId,
          weight,
          grade: task.grade ?? 0,
          lastUpdatedAt: new Date(),
        };

        await createTask({ ...payload, userId, createdAt: new Date() });
      }

      const refreshed = await getTasks(userId, null, selectedCourse.courseId);
      setTasks(refreshed);

      setSubmitSuccessMsg("All tasks submitted!");
      setTimeout(() => setSubmitSuccessMsg(""), 3000);

      onTasksChanged?.();

      return refreshed; // Important for ProposedTasksViewer callback
    } catch (err) {
      console.error("Error submitting tasks:", err);
    }
  };

  const formatDateForInput = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  return (
    <div className="edit-task">
      {tasks.map((task, index) => (
        <div key={index} className="edit-task-task-card-cont">
          <div className="edit-task-section-title">Task Name*</div>
          <input
            name={`taskName-${index}`}
            className="edit-task-text-input"
            value={task.title ?? ""}
            onChange={(e) => updateTaskField(index, "title", e.target.value)}
          />

          <div className="edit-task-section-title">Task Grade Weight*</div>
          <div className="edit-task-grade-weight-cont">
            {Object.keys(selectedCourse.gradeTypes ?? {}).map((gradeType) => (
              <label
                key={`task-${index}-grade-${gradeType}`}
                className={`edit-task-grade-weight ${
                  task.gradeType === gradeType ? "selected" : ""
                }`}
              >
                {gradeType}
                <input
                  type="radio"
                  className="hidden"
                  name={`gradeType-${index}`}
                  value={gradeType}
                  checked={task.gradeType === gradeType}
                  onChange={() =>
                    updateTaskField(index, "gradeType", gradeType)
                  }
                />
              </label>
            ))}
          </div>

          <div className="edit-task-section-title">Due Date*</div>
          <input
            type="datetime-local"
            name={`dueDate-${index}`}
            className="edit-task-text-input"
            value={
              task.dueDate ? formatDateForInput(new Date(task.dueDate)) : ""
            }
            onChange={(e) => updateTaskField(index, "dueDate", e.target.value)}
          />

          <div className="edit-task-section-title">Time Spent</div>
          <input
            name={`timeSpent-${index}`}
            className="edit-task-text-input"
            value={`${task.currentTime ?? 0} / ${task.expectedTime ?? 0}`}
            onChange={(e) => {
              const [completedStr, estimatedStr] = e.target.value
                .split("/")
                .map((s) => s.trim());
              updateTaskField(index, "currentTime", Number(completedStr) || 0);
              updateTaskField(index, "expectedTime", Number(estimatedStr) || 0);
            }}
          />

          <div className="edit-task-section-title">Task Grade</div>
          <div className="edit-task-input-cont">
            <input
              type="number"
              step="0.01"
              name={`taskGrade-${index}`}
              className="edit-task-text-input"
              value={task.grade ? (task.grade * 100).toFixed(2) : ""}
              onChange={(e) =>
                updateTaskField(index, "grade", Number(e.target.value) / 100)
              }
            />
            <div className="edit-task-right-icon">%</div>
          </div>
        </div>
      ))}

      <div className="edit-task-submit-task" onClick={submitAllTasks}>
        Submit All Tasks
      </div>

      {submitSuccessMsg && (
        <div className="edit-task-success-popup">{submitSuccessMsg}</div>
      )}
    </div>
  );
}
