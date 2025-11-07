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
  // /const [email] = useState("catlover@gmail.com");
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourseTab, setSelectedCourseTab] = useState("All Courses");
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [courseTasks, setCourseTasks] = useState<Task[]>([]);
  const [checkedMap, setCheckedMap] = useState<{ [key: number]: boolean }>({});
  const [selectedGrade, setSelectedGrade] = useState(0.0);
  const [selectedTimeSpent, setSelectedTimeSpent] = useState("0 h 0 m");

  const [showEditTask, setShowEditTask] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);

  // Load user data
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

  // Fetch tasks when course tab changes
  useEffect(() => {
    async function fetchTasks() {
      try {
        if (selectedCourseTab === "All Courses") {
          const res = await fetch("/tasks.json");
          const data = await res.json();
          setAvailableTasks(data.tasks || []);
        } else {
          const res = await fetch("/courses_with_tasks.json");
          const data = await res.json();
          const course = data.courses.find(
            (c: any) => c.name === selectedCourseTab
          );
          if (!course) return;

          setAvailableTasks(course.tasks);
          setSelectedGrade(course.currentGrade);

          // Calculate total time spent
          let totalMinutes = 0;
          course.tasks.forEach((task: any) => {
            const match = task.timeSpent.completed.match(/(\d+)h\s*(\d+)?m?/);
            const hours = parseInt(match?.[1] || "0", 10);
            const minutes = parseInt(match?.[2] || "0", 10);
            totalMinutes += hours * 60 + minutes;
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
  }, [selectedCourseTab]);

  // Example: fetch courses once
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/courses_with_tasks.json");
        const data = await res.json();
        if (data.courses) {
          setAvailableCourses([
            "All Courses",
            ...data.courses.map((c: any) => c.name),
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    }
    fetchCourses();
  }, []);

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
                <div className="color-blue">{selectedGrade}</div>
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
        {availableCourses.map((course, i) => (
          <div
            key={`task-page-${course}-${i}`}
            className={`task-page-course ${
              selectedCourseTab === course ? "selected" : ""
            }`}
            onClick={() => setSelectedCourseTab(course)}
          >
            {course}
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
              name={task.taskName}
              course={
                selectedCourseTab === "All Courses"
                  ? task.courseName
                  : selectedCourseTab
              }
              grade={task.grade}
              dueDate={task.dueDate}
              timeSpent={`${task.timeSpent.completed} / ${task.timeSpent.estimated}`}
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
          <EditCourse />
        </div>
      )}
    </div>
  );
}

export default TaskPage;
