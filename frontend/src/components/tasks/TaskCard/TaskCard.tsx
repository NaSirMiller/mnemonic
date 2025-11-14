import "./TaskCard.css";

// Define prop types
interface TaskCardProps {
  name: string;
  course: string;
  grade?: number;
  dueDate?: string;
  timeSpent?: string;
  checked?: boolean;
  onClick?: () => void;
}

function TaskCard({
  name,
  course,
  grade,
  dueDate,
  timeSpent,
  checked = false,
  onClick,
}: TaskCardProps) {
  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-card-check-box">
        {checked && <div className="task-card-checked-check-box"></div>}
      </div>

      {checked && <div className="task-card-checked-line"></div>}
      {checked && <div className="task-card-checked"></div>}
      <div className="task-card-name">{name}</div>
      <div className="task-card-course">{course}</div>
      <div className="task-card-grade">{grade ? grade + "%" : ""}</div>
      <div className="task-card-time-spent">{timeSpent}</div>
      <div className="task-card-due-date">{dueDate}</div>
    </div>
  );
}

export default TaskCard;
