// frontend/src/pages/tasks/TaskPage.tsx
import { useState, useEffect } from "react";

import { useAuth } from "../../hooks/useAuth";

import type { Course } from "../../../../shared/models/course";
import type { Task } from "../../../../shared/models/task";
import type { FullUser } from "../../../../shared/models/user";

import { getUser } from "../../services/authService";
import { getCourses } from "../../services/coursesService";
import { getTasks, updateTask } from "../../services/tasksService";
import { getDocText } from "../../services/llmService";

import TaskCard from "../../components/tasks/TaskCard/TaskCard";
import EditTask from "../../components/tasks/EditTask/EditTask";
import EditCourse from "../../components/tasks/EditCourse/EditCourse";

import "./TaskPage.css";
import { SyllabusUploader } from "../../components/file/SyllabusUploader";
import { ProposedTasksViewer } from "../../components/tasks/ProposedTasksViewer";

function TaskPage() {
  const { uid } = useAuth();
  const [user, setUser] = useState<FullUser>();
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);

  const [selectedCourseTab, setSelectedCourseTab] = useState("All Courses");
  const [selectedGrade, setSelectedGrade] = useState(0.0);
  const [selectedTimeSpent, setSelectedTimeSpent] = useState("0 h 0 m");

  const [showEditTask, setShowEditTask] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);
  const [showSyllabusForm, setShowSyllabusForm] = useState(false);
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const [showProposedTasks, setShowProposedTasks] = useState(false);
  const [proposedDocText, setProposedDocText] = useState<string | null>(null);

  // --- Helper: sort tasks ---
  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      // 1. Incomplete tasks first
      if ((a.isComplete ?? false) && !(b.isComplete ?? false)) return 1;
      if (!(a.isComplete ?? false) && (b.isComplete ?? false)) return -1;

      // 2. Sort by due date
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1; // a goes later
      if (!b.dueDate) return -1; // b goes later
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  };

  // --- Helper: get course name from courseId ---
  const getCourseName = (courseId: string | null | undefined) => {
    if (!courseId) return "";
    const match = availableCourses.find((c) => c.courseId === courseId);
    return match?.courseName ?? courseId; // fallback to ID
  };

  // --- Load user profile ---
  useEffect(() => {
    if (!uid || uid.length > 128) return;
    async function loadUser() {
      try {
        const fullUser = await getUser(uid!);
        setUser(fullUser);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }
    loadUser();
  }, [uid]);

  // --- Fetch courses ---
  useEffect(() => {
    if (!uid) return;
    async function fetchCourses() {
      try {
        const courses = await getCourses(uid!, null);
        setAvailableCourses(courses);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    }
    fetchCourses();
  }, [uid]);

  // --- Fetch tasks ---
  useEffect(() => {
    if (!uid) return;

    async function fetchTasks() {
      try {
        let tasks: Task[] = [];

        if (selectedCourseTab === "All Courses") {
          tasks = await getTasks(uid!, null, null);
        } else {
          const selectedCourse = availableCourses.find(
            (c) => c.courseName === selectedCourseTab
          );
          if (!selectedCourse) return;

          tasks = await getTasks(uid!, null, selectedCourse.courseId);

          setSelectedGrade(selectedCourse.currentGrade ?? 0);

          // Calculate total time spent
          const totalHoursDecimal = tasks.reduce(
            (sum, t) => sum + (t.currentTime ?? 0),
            0
          );
          const hours = Math.floor(totalHoursDecimal);
          const minutes = Math.round((totalHoursDecimal - hours) * 60);
          setSelectedTimeSpent(`${hours}hr ${minutes}min`);
        }

        const sorted = sortTasks(tasks);
        setAvailableTasks(sorted);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    }

    fetchTasks();
  }, [selectedCourseTab, availableCourses, uid]);

  // --- Prevent background scroll when modals open ---
  useEffect(() => {
    document.body.style.overflow =
      showEditTask || showEditCourse ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showEditTask, showEditCourse]);

  // --- Toggle task completion ---
  const toggleChecked = async (index: number) => {
    const task = availableTasks[index];
    if (!task || !uid || !task.taskId) return;

    const updatedIsComplete = !task.isComplete;

    setAvailableTasks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], isComplete: updatedIsComplete };
      return copy;
    });

    try {
      await updateTask(uid, task.taskId, { isComplete: updatedIsComplete });
    } catch (err) {
      console.error("Failed to update task completion:", err);
      setAvailableTasks((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], isComplete: task.isComplete ?? false };
        return copy;
      });
    }
  };

  // --- Refresh courses/tasks ---
  const refreshCourses = async () => {
    if (!uid) return;
    try {
      const courses = await getCourses(uid, null);
      setAvailableCourses(courses);

      if (selectedCourseTab !== "All Courses") {
        const selectedCourse = courses.find(
          (c) => c.courseName === selectedCourseTab
        );
        if (!selectedCourse) setSelectedCourseTab("All Courses");
      }

      await refreshTasks();
    } catch (err) {
      console.error("Failed to refresh courses:", err);
    }
  };

  const refreshTasks = async () => {
    if (!uid) return;
    try {
      let tasks: Task[] = [];

      if (selectedCourseTab === "All Courses") {
        tasks = await getTasks(uid, null, null);
      } else {
        const selectedCourse = availableCourses.find(
          (c) => c.courseName === selectedCourseTab
        );
        if (!selectedCourse) return;

        tasks = await getTasks(uid, null, selectedCourse.courseId);
      }

      const sorted = sortTasks(tasks);
      setAvailableTasks(sorted);
    } catch (err) {
      console.error("Failed to refresh tasks:", err);
    }
  };

  const handleSyllabusSubmit = (file: File) => {
    setSyllabusFile(file); // store file to pass to ProposedTasksViewer
    setShowSyllabusForm(false); // close uploader popup
    setShowProposedTasks(true); // open ProposedTasksViewer popup
  };

  useEffect(() => {
    if (!syllabusFile) return;

    const loadDoc = async () => {
      try {
        const { doc } = await getDocText(syllabusFile);
        setProposedDocText(doc);
        setShowProposedTasks(true); // show viewer after processing
      } catch (err) {
        console.error("Failed to load syllabus:", err);
      }
    };

    loadDoc();
  }, [syllabusFile]);

  return (
    <div className="task-page">
      {/* Profile Section */}
      <div className="task-page-profile-cont">
        <img
          src={user?.photoUrl ?? "/images/profile.png"}
          alt={`${user?.email ?? "user"}'s profile picture`}
          className="task-page-profile-pic"
        />
        {selectedCourseTab === "All Courses" ? (
          <div className="task-page-profile-name">
            {user?.email ?? "user@example.com"}
          </div>
        ) : (
          <div className="task-page-course-info">
            <div className="task-page-course-name">{selectedCourseTab}</div>
            <div className="task-page-course-details-cont">
              <div className="task-page-course-detail">
                <div>Number of Tasks</div>
                <div className="color-blue">{availableTasks.length}</div>
              </div>
              <div className="task-page-course-detail">
                <div>Current Grade</div>
                <div className="color-blue">
                  {(selectedGrade * 100).toFixed(2)}
                </div>
              </div>
              <div className="task-page-course-detail">
                <div>Total Time Spent</div>
                <div className="color-blue">{selectedTimeSpent}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Buttons */}
      <div className="task-page-edit-cont">
        <div
          className="task-page-edit-button"
          onClick={() => setShowEditTask(!showEditTask)}
        >
          Edit Tasks
        </div>
        <div
          className="task-page-edit-button"
          onClick={() => setShowEditCourse(!showEditCourse)}
        >
          Edit Courses
        </div>
        <div
          className="task-page-syllabus-button"
          onClick={() => setShowSyllabusForm(!showSyllabusForm)}
        >
          Upload Syllabus
        </div>
      </div>

      {/* Course Tabs */}
      <div className="task-page-course-cont">
        {[
          "All Courses",
          ...availableCourses.map((c) => c.courseName ?? ""),
        ].map((courseName, i) => (
          <div
            key={`task-page-${courseName}-${i}`}
            className={`task-page-course ${
              selectedCourseTab === courseName ? "selected" : ""
            }`}
            onClick={() => setSelectedCourseTab(courseName)}
          >
            {courseName}
          </div>
        ))}
      </div>

      {/* Task List */}
      <div className="task-page-task-cont">
        <div className="task-page-task-label-cont">
          <div className="task-page-task-label-checkbox"></div>
          <div className="task-page-task-label-name">Name</div>
          <div className="task-page-task-label-course">Course</div>
          <div className="task-page-task-label-grade">Grade</div>
          <div className="task-page-task-label-time-spent">Time Spent</div>
          <div className="task-page-task-label-due-date">Due Date</div>
        </div>
        <div className="task-page-task-flex-cont">
          {availableTasks.map((task, i) => (
            <TaskCard
              key={`task-card-${i}`}
              name={task.title ?? ""}
              course={
                selectedCourseTab === "All Courses"
                  ? getCourseName(task.courseId)
                  : selectedCourseTab
              }
              grade={task.grade! * 100}
              dueDate={
                task.dueDate
                  ? new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(task.dueDate)
                  : "No due date"
              }
              timeSpent={`${task.currentTime ?? 0} / ${task.expectedTime ?? 0}`}
              checked={task.isComplete ?? false}
              onClick={() => toggleChecked(i)}
            />
          ))}
        </div>
      </div>

      {/* Edit Modals */}
      {showEditTask && (
        <div className="opacity" onClick={() => setShowEditTask(false)}>
          <EditTask onTasksChanged={refreshTasks} />
        </div>
      )}
      {showEditCourse && (
        <div className="opacity" onClick={() => setShowEditCourse(false)}>
          <EditCourse onCoursesChanged={refreshCourses} />
        </div>
      )}
      {showSyllabusForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowSyllabusForm(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <div className="modal-header">
              <h2>Upload Syllabus</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowSyllabusForm(false)}
              >
                ×
              </button>
            </div>

            <SyllabusUploader onSubmit={handleSyllabusSubmit} />
          </div>
        </div>
      )}

      {showProposedTasks && proposedDocText && (
        <div
          className="modal-overlay"
          onClick={() => setShowProposedTasks(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Proposed Course & Tasks</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowProposedTasks(false)}
              >
                ×
              </button>
            </div>

            <ProposedTasksViewer document={proposedDocText} useMock={true} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskPage;
