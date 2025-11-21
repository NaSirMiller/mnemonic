import { useState, useEffect } from "react";
import type { Task } from "../../../../shared/models/task";
import type { Course } from "../../../../shared/models/course";

interface TaskFormProps {
  task?: Task;
  course?: Course | null;
  onChange?: (task: Task) => void; // expose current state
}

export function TaskForm({ task, course, onChange }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [gradeType, setGradeType] = useState(task?.gradeType ?? "");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""
  );
  const [currentTime, setCurrentTime] = useState(task?.currentTime ?? 0);
  const [expectedTime, setExpectedTime] = useState(task?.expectedTime ?? 0);
  const [grade, setGrade] = useState(task?.grade ? task.grade * 100 : 0);

  useEffect(() => {
    if (onChange) {
      onChange({
        ...task,
        title,
        gradeType,
        dueDate: dueDate ? new Date(dueDate) : null,
        currentTime,
        expectedTime,
        grade: grade / 100,
        courseId: course?.courseId ?? task?.courseId ?? "",
      } as Task);
    }
  }, [
    title,
    gradeType,
    dueDate,
    currentTime,
    expectedTime,
    grade,
    course,
    onChange,
    task,
  ]);

  return (
    <div className="edit-task">
      <div className="edit-task-section-title">Task Name*</div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />

      <div className="edit-task-section-title">Task Grade Weight*</div>
      <select value={gradeType} onChange={(e) => setGradeType(e.target.value)}>
        <option value="">Select</option>
        {course &&
          Object.keys(course.gradeTypes ?? {}).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
      </select>

      <div className="edit-task-section-title">Due Date</div>
      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <div className="edit-task-section-title">Time Spent</div>
      <input
        value={`${currentTime} / ${expectedTime}`}
        onChange={(e) => {
          const [c, eT] = e.target.value
            .split("/")
            .map((v) => Number(v.trim()));
          setCurrentTime(c ?? 0);
          setExpectedTime(eT ?? 0);
        }}
      />

      <div className="edit-task-section-title">Task Grade</div>
      <input
        type="number"
        value={grade}
        onChange={(e) => setGrade(Number(e.target.value))}
      />
    </div>
  );
}
