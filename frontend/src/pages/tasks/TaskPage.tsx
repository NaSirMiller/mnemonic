import { useState, useEffect } from "react";

import { useAuth } from "../../hooks/useAuth";

import type { Course } from "../../../../shared/models/course";
import type { Task } from "../../../../shared/models/task";
import type { FullUser } from "../../../../shared/models/user";
import { getUser } from "../../services/authService";
import { getCourses } from "../../services/coursesService";
import { getTasks } from "../../services/tasksService";

import TaskCard from "../../components/tasks/TaskCard";
import EditTask from "../../components/tasks/EditTask/EditTask";
import EditCourse from "../../components/tasks/EditCourse/EditCourse";
import "./TaskPage.css";

function TaskPage() {
  const { uid } = useAuth();
  const [user, setUser] = useState<FullUser>();

  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);

  const [selectedCourseTab, setSelectedCourseTab] = useState("All Courses");
  const [checkedMap, setCheckedMap] = useState<{ [key: number]: boolean }>({});
  const [selectedGrade, setSelectedGrade] = useState(0.0);
  const [selectedTimeSpent, setSelectedTimeSpent] = useState("0 h 0 m");

  const [showEditTask, setShowEditTask] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);

  // Load user data for profile information
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

  // Get all course data for a user, and get all course names for the tab bar
  useEffect(() => {
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

  // Get tasks data for the selected tab
  useEffect(() => {
    async function fetchTasks() {
      try {
        if (selectedCourseTab === "All Courses") {
          const allCourseTasks = await getTasks(uid!, null, null);
          setAvailableTasks(allCourseTasks);
        } else {
          const selectedCourse: Course = availableCourses.find(
            (course) => course.courseName === selectedCourseTab
          )!;
          const selectedCourseTasks = await getTasks(
            uid!,
            null,
            selectedCourse.courseId
          );
          setAvailableTasks(selectedCourseTasks);
          setSelectedGrade(selectedCourse.currentGrade!);

          // Calculate total time spent
          let totalMinutes = 0;
          selectedCourseTasks.forEach((task: Task) => {
            const completedTime = task.currentTime ?? 0;
            totalMinutes += completedTime;
          });
          const totalHours = Math.floor(totalMinutes / 60);
          const remainingMinutes = totalMinutes % 60;
          setSelectedTimeSpent(`${totalHours}hr ${remainingMinutes}min`);
        }
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    }

    fetchTasks();
  }, [selectedCourseTab, availableCourses, uid]);

  // Prevent background scrolling when edit modals are open
  useEffect(() => {
    document.body.style.overflow =
      showEditTask || showEditCourse ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showEditTask, showEditCourse]);

  // Reset checked map when available tasks change
  useEffect(() => {
    const initialMap: { [key: number]: boolean } = {};
    availableTasks.forEach((_, i) => {
      initialMap[i] = false;
    });
    setCheckedMap(initialMap);
  }, [availableTasks]);

  // Toggle task checked state
  const toggleChecked = (index: number) => {
    setCheckedMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const refreshCourses = async () => {
    if (!uid) return;
    try {
      const courses = await getCourses(uid, null);
      setAvailableCourses(courses);

      // If selected course no longer exists, reset to "All Courses"
      if (selectedCourseTab !== "All Courses") {
        const selectedCourse = courses.find(c => c.courseName === selectedCourseTab);
        if (!selectedCourse) {
          setSelectedCourseTab("All Courses"); // <-- force refresh
        }
      }

      // Refresh tasks
      if (selectedCourseTab === "All Courses" || courses.length === 0) {
        const tasks = await getTasks(uid, null, null);
        setAvailableTasks(tasks);
        setSelectedGrade(0);
        setSelectedTimeSpent("0hr 0min");
      } else {
        const selectedCourse = courses.find(c => c.courseName === selectedCourseTab);
        if (selectedCourse) {
          const tasks = await getTasks(uid, null, selectedCourse.courseId);
          setAvailableTasks(tasks);
          setSelectedGrade(selectedCourse.currentGrade ?? 0);

          let totalMinutes = 0;
          tasks.forEach(t => totalMinutes += t.currentTime ?? 0);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          setSelectedTimeSpent(`${hours}hr ${minutes}min`);
        }
      }
    } catch (err) {
      console.error("Failed to refresh courses/tasks:", err);
    }
  };



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
            {user?.email ?? "catlover@gmail.com"}
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
      </div>

      {/* Course Tabs */}
      <div className="task-page-course-cont">
        {["All Courses", ...availableCourses.map((c) => c.courseName!)].map(
          (courseName, i) => (
            <div
              key={`task-page-${courseName}-${i}`}
              className={`task-page-course ${
                selectedCourseTab === courseName ? "selected" : ""
              }`}
              onClick={() => setSelectedCourseTab(courseName)}
            >
              {courseName}
            </div>
          )
        )}
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
              name={task.title}
              course={
                selectedCourseTab === "All Courses"
                  ? task.title
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
              timeSpent={`${task.currentTime} / ${task.expectedTime}`}
              checked={checkedMap[i]}
              onClick={() => toggleChecked(i)}
            />
          ))}
        </div>
      </div>

      {/* Edit Modals */}
      {showEditTask && (
        <div className="opacity" onClick={() => setShowEditTask(false)}>
          <EditTask />
        </div>
      )}
    {showEditCourse && (
      <div className="opacity" onClick={() => setShowEditCourse(false)}>
        <EditCourse onCoursesChanged={refreshCourses} />
      </div>
    )}
    </div>
  );
}

export default TaskPage;
