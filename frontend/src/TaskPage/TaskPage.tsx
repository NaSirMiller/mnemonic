import { useState, useEffect } from "react";

import TaskCard from "./TaskCard";
import "./TaskPage.css";
// import NavBar from "../components/NavBar/NavBar";
import type { Task } from "../../../shared/models/task";
import { getTasks } from "../services/tasksService";

function TaskPage() {
  const [email, setEmail] = useState("catlover@gmail.com");
  const [courses, setCourses] = useState(["All Courses"]);
  // const filters = ["Name", "Course", "% of Grade", "Time Spent", "Due Date"];

  const [tasks, setTasks] = useState<Task[]>([]);
  const [checkedMap, setCheckedMap] = useState({}); // key = task index, value = boolean
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [selectedGrade, setSelectedGrade] = useState(0.0);
  const [selectedTimeSpent, setTimeSpent] = useState("0 hr 0 min");

  const fetchTasks = async () => {
    try {
      const tasks = await getTasks("", null);
      setTasks(tasks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch("/courses.json")
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) {
          const names = data.courses.map((course) => course.name);
          setCourses(["All Courses", ...names]);
        }
      });

    // console.log( tasks );
  }, []);

  useEffect(() => {
    const initialMap = {};
    tasks.forEach((_, i) => {
      initialMap[i] = false;
    });
    setCheckedMap(initialMap);
  }, [tasks]);

  useEffect(() => {
    if (selectedCourse === "All Courses") {
      fetchTasks();
    } else {
      fetch("/courses_with_tasks.json")
        .then((res) => res.json())
        .then((data) => {
          const course = data.courses.find((c) => c.name === selectedCourse);
          setTasks(course.tasks);
          setSelectedGrade(course.currentGrade);

          let totalMinutes = 0;
          course.tasks.forEach((task: Task) => {
            const match = task.timeSpent.completed.match(/(\d+)h\s*(\d+)?m?/);
            const hours = parseInt(match[1]) || 0;
            const minutes = parseInt(match[2]) || 0;
            totalMinutes += hours * 60 + minutes;
          });
          const totalHours = Math.floor(totalMinutes / 60);
          const remainingMinutes = totalMinutes % 60;
          const totalTimeString = `${totalHours}hr ${remainingMinutes}min`;
          setTimeSpent(totalTimeString);
        });
    }
  }, [selectedCourse]);

  const toggleChecked = (index) => {
    setCheckedMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
    // console.log( checkedMap[ index ] );
  };

  return (
    <div className="task-page">
      <div className="task-page-profile-cont">
        <img
          src="/images/profile.png"
          alt={email + "'s profile picture"}
          className="task-page-profile-pic"
        />
        {selectedCourse === "All Courses" ? (
          <div className="task-page-profile-name">{email}</div>
        ) : (
          <div className="task-page-course-info">
            <div className="task-page-course-name">{selectedCourse}</div>
            <div className="task-page-course-details-cont">
              <div className="task-page-course-detail">
                <div>Number of Tasks</div>
                <div className="color-blue">{tasks.length}</div>
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
      <div className="task-page-edit-cont">
        <div className="task-page-edit-button">Edit Tasks</div>
        <div className="task-page-edit-button">Edit Courses</div>
      </div>
      <div className="task-page-course-cont">
        {courses.map((course, i) => (
          <div
            key={"task-page-" + course + "-" + i}
            className={`task-page-course ${
              selectedCourse === course ? "selected" : ""
            }`}
            onClick={() => setSelectedCourse(course)}
          >
            {course}
          </div>
        ))}
      </div>
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
          {tasks.map((task, i) => (
            <TaskCard
              key={"task-card-" + i}
              name={task.taskName}
              course={
                selectedCourse === "All Courses"
                  ? task.courseName
                  : selectedCourse
              }
              grade={task.grade}
              dueDate={task.dueDate}
              timeSpent={
                task.timeSpent.completed + " / " + task.timeSpent.estimated
              }
              checked={checkedMap[i]}
              onClick={() => toggleChecked(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskPage;
