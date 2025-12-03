import type { Task } from "../../../../../shared/models/task";
import type { Course } from "../../../../../shared/models/course";

import "./TaskForm.css";

interface TaskFormProps {
  task: Task;
  course?: Course | null;
  onChange: (task: Task) => void;
  onRemove?: () => void;
}

export function TaskForm({ task, course, onChange, onRemove }: TaskFormProps) {
  const update = (patch: Partial<Task>) => {
    onChange({ ...task, ...patch });
  };

  return (
    <div className="task-form-container">
      <div className="task-form-title">Task Form </div>
      <div className="task-form-section-title">Task Name*</div>
      <input
        className="task-form-text-input"
        value={task.title}
        onChange={(e) => update({ title: e.target.value })}
      />
      <div className="task-form-section-title">Task Grade Type*</div>
      {course ? (
        <select
          className="task-form-select"
          value={task.gradeType ?? ""}
          onChange={(e) => update({ gradeType: e.target.value })}
        >
          <option value="">Select</option>
          {Object.keys(course.gradeTypes ?? {}).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="task-form-text-input"
          placeholder="Enter grade type"
          value={task.gradeType ?? ""}
          onChange={(e) => update({ gradeType: e.target.value })}
        />
      )}
      <div className="task-form-section-title">Due Date</div>
      <input
        className="task-form-text-input"
        type="datetime-local"
        value={
          task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""
        }
        onChange={(e) =>
          update({
            dueDate: e.target.value ? new Date(e.target.value) : null,
          })
        }
      />
      <div className="task-form-section-title">Description</div>
      <textarea
        className="task-form-text-input"
        value={task.description ?? ""}
        onChange={(e) =>
          update({
            description: e.target.value,
          })
        }
      />
      {/* Remove Task Button */}
      {onRemove && (
        <button className="remove-task-button" onClick={onRemove}>
          Ignore Task
        </button>
      )}
    </div>
  );
}

// <div className="task-form-section-title">Time Spent</div>
// <input
//   className="task-form-text-input"
//   value={`${task.currentTime} / ${task.expectedTime}`}
//   onChange={(e) => {
//     const [c, eT] = e.target.value
//       .split("/")
//       .map((v) => Number(v.trim()));
//     update({
//       currentTime: c ?? 0,
//       expectedTime: eT ?? 0,
//     });
//   }}
// />

// <div className="task-form-section-title">Task Grade (%)</div>
// <input
//   className="task-form-text-input"
//   type="number"
//   value={(task.grade ?? 0) * 100}
//   onChange={(e) =>
//     update({
//       grade: Number(e.target.value) / 100,
//     })
//   }
// />
