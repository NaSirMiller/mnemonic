import { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import "./EditTask.css";
import { AuthContext } from "../../context/AuthContext";
import { getCourses, updateCourse } from "../../../services/coursesService";
import { getTasks, createTask, updateTask, deleteTask } from "../../../services/tasksService";
import type { Course } from "../../../../../shared/models/course";
import type { Task } from "../../../../../shared/models/task";

type EditTaskProps = {
  onTasksChanged?: () => void;
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

  const [taskNameError, setTaskNameError] = useState<string>("");

  // Separate success messages
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string>("");
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string>("");

  const formatDateForInput = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const recalculateGrade = async (userId: string, courseId: string) => {
    try {
      const tasks = await getTasks(userId, null, courseId);
      const course = await getCourses(userId, courseId);
      const grouped: Record<string, { sum: number; count: number; weight: number }> = {};
      
      for (let i = 0; i < tasks.length; i++){
        const type = tasks[i].gradeType ?? "";
        // Ignore missing or zero/negative grades
        const grade = tasks[i].grade ?? 0;
        if (grade <= 0) continue;
        if (!grouped[type]) {
          grouped[type] = { sum: 0, count: 0, weight: tasks[i].weight || 0 };
        }
        grouped[type].sum += grade;
        grouped[type].count++;
      }

      
      // If no graded tasks exist at all
      if (Object.keys(grouped).length === 0) {
        await updateCourse(userId, courseId, {
          ...course[0],
          currentGrade: 0
        });
        return;
      }

      // --- NORMALIZE WEIGHTS ---
      let totalWeight = 0;
      for (const type in grouped) {
        totalWeight += grouped[type].weight;
      }
      // Normalize so remaining weights sum to 1
      for (const type in grouped) {
        grouped[type].weight = grouped[type].weight / totalWeight;
      }

      let grade = 0;
      
      for (const type in grouped) {
        const { sum, count, weight } = grouped[type];
        const avg = sum / count;      
        grade += avg * weight;   
      }
      grade = Number(grade.toFixed(4));
      const updatedCourse: Course = {
        courseName: course[0].courseName,
        currentGrade: grade,
        gradeTypes: course[0].gradeTypes,
        userId: userId
      };
      await updateCourse(userId, courseId, updatedCourse);
    } catch (error) {
      console.error("Couldn't set grade: ", error);
    }
  }

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

  useEffect(() => {
    if (!selectedTask) {
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

  const sortTasksForDisplay = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      const gradeA = a.gradeType ?? "";
      const gradeB = b.gradeType ?? "";
      if (gradeA < gradeB) return -1;
      if (gradeA > gradeB) return 1;

      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  };

  const submitForm = async () => {
    if (!selectedCourse || !userId) return;

    try {
      const nameTaken = tasks.some(
        (t) =>
          (t.title ?? "").trim().toLowerCase() === taskName.trim().toLowerCase() &&
          t.taskId !== selectedTask?.taskId
      );

      if (nameTaken) {
        setTaskNameError("Task name already exists in this course!");
        if (selectedTask) {
          setTaskName(selectedTask.title ?? "");
          setTaskGradeWeight(selectedTask.gradeType ?? "");
          setSelectedGradeWeight(selectedTask.gradeType ?? "");
          setDueDate(
            selectedTask.dueDate
              ? formatDateForInput(new Date(selectedTask.dueDate))
              : ""
          );
          const completed = selectedTask.currentTime ?? 0;
          const estimated = selectedTask.expectedTime ?? 0;
          setTimeSpent(`${completed} / ${estimated}`);
          setTaskGrade(((selectedTask.grade ?? 0) * 100).toFixed(2));
        }
        return;
      }

      setTaskNameError("");

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

      // Recalculate course grade based on all updates, including deletion and grade type changes
      if (selectedCourse.courseId != null) {
        await recalculateGrade(userId, selectedCourse.courseId);
      }

      // Refresh tasks for current course only
      const refreshed = await getTasks(userId, null, selectedCourse.courseId);
      setTasks(refreshed);

      const updated =
        refreshed.find(
          (t) => t.title === taskName && t.courseId === selectedCourse.courseId
        ) ?? null;
      setSelectedTask(updated);

      // SUCCESS POPUP FOR SUBMIT
      setSubmitSuccessMsg("Task submitted!");
      setTimeout(() => setSubmitSuccessMsg(""), 2000);

      onTasksChanged?.();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

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

  const handleDeleteTask = async () => {
    if (!selectedTask?.taskId || !userId) return;
    try {
      await deleteTask(userId, selectedTask.taskId);
      const refreshed = await getTasks(userId, null, selectedCourse?.courseId ?? null);
      setTasks(refreshed);
      setSelectedTask(refreshed[0] ?? null);

      // SUCCESS POPUP FOR DELETE
      setDeleteSuccessMsg("Task deleted!");
      setTimeout(() => setDeleteSuccessMsg(""), 2000);

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

      {/* Task Name */}
      <div className="edit-task-section-title">Task Name*</div>
      <input
        name="taskName"
        className="edit-task-text-input"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      {taskNameError && <div className="edit-task-error">{taskNameError}</div>}

      {/* Grade Weight */}
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

      {/* Due Date */}
      <div className="edit-task-section-title">Due Date*</div>
      <input
        type="datetime-local"
        name="dueDate"
        className="edit-task-text-input"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      {/* Time Spent */}
      <div className="edit-task-section-title">Time Spent</div>
      <input
        name="timeSpent"
        className="edit-task-text-input"
        value={timeSpent}
        onChange={(e) => setTimeSpent(e.target.value)}
      />

      {/* Grade */}
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

      <Modal
        isOpen={!!submitSuccessMsg}
        onRequestClose={() => setSubmitSuccessMsg(null)}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <div className="error-label">Success</div>
        <div className="error-message">{submitSuccessMsg}</div>
        <button
          onClick={() => setSubmitSuccessMsg(null)}
          className="modal-close-button"
        >
          Close
        </button>
      </Modal>


      <div className="edit-task-delete-task" onClick={handleDeleteTask}>
        Delete Task
      </div>

      <Modal
        isOpen={!!deleteSuccessMsg}
        onRequestClose={() => setDeleteSuccessMsg(null)}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <div className="error-label">Success</div>
        <div className="error-message">{deleteSuccessMsg}</div>
        <button
          onClick={() => setDeleteSuccessMsg(null)}
          className="modal-close-button"
        >
          Close
        </button>
      </Modal>
    </div>
  );
}

export default EditTask;
