import { useState, useEffect, useContext } from "react";
import "./EditTask.css";
import { AuthContext } from "../../context/AuthContext";
import { getCourses } from "../../../services/coursesService";
import { getTasks, createTask, updateTask, deleteTask } from "../../../services/tasksService";
import type { Course } from "../../../../../shared/models/course";
import type { Task } from "../../../../../shared/models/task";

type EditTaskProps = {
  onTasksChanged?: () => void; // Callback to refresh parent task page
};

function EditTask({ onTasksChanged }: EditTaskProps) {
  const auth = useContext(AuthContext);
  const userId = auth?.uid;

  const [taskName, setTaskName] = useState<string>("");
  const [taskGradeWeight, setTaskGradeWeight] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [timeSpent, setTimeSpent] = useState<string>("");
  const [taskGrade, setTaskGrade] = useState<string>("");

  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [gradeWeights, setGradeWeights] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedGradeWeight, setSelectedGradeWeight] = useState<string>("");

  // --- Helper to convert Date to local datetime-local string ---
  const formatDateForInput = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000; // offset in ms
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  // --- Load courses ---
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const fetched = await getCourses(userId, null);
        setCourses(fetched);
        if (fetched.length > 0) {
          setSelectedCourse(fetched[0]);
          setGradeWeights(Object.keys(fetched[0].gradeTypes || {}));
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    })();
  }, [userId]);

  // --- Load tasks + gradeWeights when course changes ---
  useEffect(() => {
    if (!selectedCourse || !userId) return;
    (async () => {
      try {
        const fetchedTasks = await getTasks(userId, null, selectedCourse.courseId);
        setTasks(fetchedTasks);
        setSelectedTask(fetchedTasks.length > 0 ? fetchedTasks[0] : null);
        setGradeWeights(Object.keys(selectedCourse.gradeTypes || {}));
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    })();
  }, [selectedCourse, userId]);

  // --- Populate form when a task is selected ---
  useEffect(() => {
    if (!selectedTask) {
      // Clear form if no task selected
      setTaskName("");
      setTaskGradeWeight("");
      setSelectedGradeWeight("");
      setDueDate("");
      setTimeSpent("");
      setTaskGrade("");
      return;
    }

    setTaskName(selectedTask.title ?? "");
    setTaskGradeWeight(selectedTask.gradeType ?? "");
    setSelectedGradeWeight(selectedTask.gradeType ?? "");
    setDueDate(
      selectedTask.dueDate ? formatDateForInput(new Date(selectedTask.dueDate)) : ""
    );
    const completed = selectedTask.currentTime ?? 0;
    const estimated = selectedTask.expectedTime ?? 0;
    setTimeSpent(`${completed} / ${estimated}`);
    setTaskGrade(((selectedTask.grade ?? 0) * 100).toFixed(2));
  }, [selectedTask]);

  // --- Sort tasks by gradeType then dueDate ---
  const sortTasksForDisplay = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      const gradeA = a.gradeType ?? "";
      const gradeB = b.gradeType ?? "";
      if (gradeA < gradeB) return -1;
      if (gradeA > gradeB) return 1;

      // Sort by dueDate within gradeType
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  };

  // --- Submit form (create or update) ---
  const submitForm = async () => {
    if (!selectedCourse || !userId) return;
    try {
      const [completedStr, estimatedStr] = timeSpent.split("/").map((s) => s.trim());
      const weight =
        selectedCourse.gradeTypes && taskGradeWeight
          ? selectedCourse.gradeTypes[taskGradeWeight]
          : 0;

      const payload: Task = {
        courseId: selectedCourse.courseId,
        title: taskName,
        gradeType: taskGradeWeight,
        weight,
        grade: taskGrade ? Number(taskGrade) / 100 : 0,
        dueDate: dueDate ? new Date(dueDate) : null,
        currentTime: Number(completedStr) || 0,
        expectedTime: Number(estimatedStr) || 0,
        lastUpdatedAt: new Date(),
      };

      if (selectedTask?.taskId) {
        await updateTask(userId, selectedTask.taskId, payload);
      } else {
        await createTask({ ...payload, userId, createdAt: new Date() });
      }

      const refreshed = await getTasks(userId, null, selectedCourse.courseId);
      setTasks(refreshed);

      const updated =
        refreshed.find(
          (t) => t.title === taskName && t.courseId === selectedCourse.courseId
        ) ?? null;
      setSelectedTask(updated);

      onTasksChanged?.();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  // --- Add new task ---
  const handleNewTask = async () => {
    if (!selectedCourse || !userId) return;

    try {
      const baseName = "New Task";
      const existingNames = tasks.map((t) => t.title);

      let newTaskName: string;
      if (!existingNames.includes(baseName)) {
        newTaskName = baseName;
      } else {
        let nextNumber = 1;
        while (existingNames.includes(`${baseName} ${nextNumber}`)) {
          nextNumber++;
        }
        newTaskName = `${baseName} ${nextNumber}`;
      }

      const newTask: Task = {
        userId,
        courseId: selectedCourse.courseId,
        title: newTaskName,
        grade: 0,
        gradeType: "",
        weight: 0,
        dueDate: new Date(),
        currentTime: 0,
        expectedTime: 0,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      };

      const created = await createTask(newTask);

      const refreshed = await getTasks(userId, null, selectedCourse.courseId);
      setTasks(refreshed);

      const newlyCreated =
        refreshed.find((t) => t.taskId === created.taskId) ?? refreshed.at(-1) ?? null;
      setSelectedTask(newlyCreated);

      onTasksChanged?.();
    } catch (err) {
      console.error("Error creating new task:", err);
    }
  };

  // --- Delete task ---
  const handleDeleteTask = async () => {
    if (!selectedTask?.taskId || !userId) return;
    try {
      await deleteTask(userId, selectedTask.taskId);
      const refreshed = await getTasks(userId, null, selectedCourse?.courseId ?? null);
      setTasks(refreshed);
      setSelectedTask(refreshed[0] ?? null);

      onTasksChanged?.();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="edit-task" onClick={(e) => e.stopPropagation()}>
      <div className="edit-task-title">Edit Tasks</div>

      {/* Courses */}
      <div className="edit-task-course-cont">
        {courses.map((course, i) => (
          <div
            key={`edit-task-${course.courseName}-${i}`}
            className={`edit-task-course ${
              selectedCourse?.courseName === course.courseName ? "selected" : ""
            }`}
            onClick={() => setSelectedCourse(course)}
          >
            {course.courseName}
          </div>
        ))}
      </div>

      {/* Task selection */}
      <div className="edit-task-section-title">Select Task*</div>
      <div className="edit-task-select-cont">
        <div className="edit-task-select-label-cont">
          <div className="edit-task-select-label-name">Name</div>
          <div className="edit-task-select-label-grade">Grade</div>
          <div className="edit-task-select-label-time-spent">Time Spent</div>
          <div className="edit-task-select-label-due-date">Date</div>
        </div>
        <div className="edit-task-task-card-cont">
          {sortTasksForDisplay(tasks).map((task, i) => (
            <div
              key={`edit-task-task-card-${i}`}
              className={`edit-task-task-card ${
                selectedTask?.taskId === task.taskId ? "selected" : ""
              }`}
              onClick={() => setSelectedTask(task)}
            >
              <div className="edit-task-task-card-name">{task.title}</div>
              <div className="edit-task-task-card-grade">{(task.grade ?? 0) * 100}</div>
              <div className="edit-task-task-card-time-spent">
                {`${task.currentTime ?? 0} / ${task.expectedTime ?? 0}`}
              </div>
              <div className="edit-task-task-card-due-date">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : ""}
              </div>
            </div>
          ))}
          <div className="edit-task-task-card" onClick={handleNewTask}>
            <div className="edit-task-task-card-name">Add a New Task</div>
            <div className="edit-task-task-card-grade">0</div>
            <div className="edit-task-task-card-time-spent">0 / 0</div>
            <div className="edit-task-task-card-due-date">
              {new Date().toLocaleString("en-US", { month: "short", day: "numeric" })}
            </div>
            <div className="edit-task-dark-card"></div>
          </div>
        </div>
      </div>

      {/* Task Form */}
      <div className="edit-task-section-title">Task Name*</div>
      <input
        name="taskName"
        className="edit-task-text-input"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />

      <div className="edit-task-section-title">Task Grade Weight*</div>
      <div className="edit-task-grade-weight-cont">
        {gradeWeights.map((gradeWeight, i) => (
          <label
            key={`edit-task-grade-weight-${i}`}
            className={`edit-task-grade-weight ${
              selectedGradeWeight === gradeWeight ? "selected" : ""
            }`}
          >
            {gradeWeight}
            <input
              className="hidden"
              type="radio"
              name="gradeWeight"
              value={gradeWeight}
              checked={selectedGradeWeight === gradeWeight}
              onChange={() => {
                setTaskGradeWeight(gradeWeight);
                setSelectedGradeWeight(gradeWeight);
              }}
            />
          </label>
        ))}
      </div>

      <div className="edit-task-section-title">Due Date*</div>
      <input
        type="datetime-local"
        name="dueDate"
        className="edit-task-text-input"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <div className="edit-task-section-title">Time Spent</div>
      <input
        name="timeSpent"
        className="edit-task-text-input"
        value={timeSpent}
        onChange={(e) => setTimeSpent(e.target.value)}
      />

      <div className="edit-task-section-title">Task Grade</div>
      <div className="edit-task-input-cont">
        <input
          type="number"
          step="0.01"
          name="taskGrade"
          className="edit-task-text-input"
          value={taskGrade}
          onChange={(e) => setTaskGrade(e.target.value)}
        />
        <div className="edit-task-right-icon">%</div>
      </div>

      <div className="edit-task-submit-task" onClick={submitForm}>
        Submit Task
      </div>
      <div className="edit-task-delete-task" onClick={handleDeleteTask}>
        Delete Task
      </div>
    </div>
  );
}

export default EditTask;
