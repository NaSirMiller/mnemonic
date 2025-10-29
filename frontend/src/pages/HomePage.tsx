import { useState } from 'react';
import "../style.css";

interface Course {
  id: string;
  name: string;
}

interface Task {
  id: string;
  courseId: string;
  courseName: string;
  name: string;
  percentOfGrade: number;
  timeSpent: number; // minutes
  timeEstimated: number; //also minutes
  dueDate: string;
  completed: boolean;
}

const mockCourses: Course[] = [
  { id: 'c1', name: 'Software Design and ...' },
  { id: 'c2', name: 'Data Structures' },
  { id: 'c3', name: 'Computer Architecture ...' },
  { id: 'c4', name: 'Intro to Computer Science' },
];

const mockTasks: Task[] = [
  { id: 't1', courseId: 'c1', courseName: 'Software Design and ...', name: 'Mid Term Presentation', percentOfGrade: 2.46, timeSpent: 930, timeEstimated: 2400, dueDate: 'Oct 12, 9:30 PM', completed: false },
  { id: 't2', courseId: 'c2', courseName: 'Data Structures', name: 'Homework 6', percentOfGrade: 98.99, timeSpent: 13170, timeEstimated: 12000, dueDate: 'MMM 88, 10:00 PM', completed: false },
  { id: 't3', courseId: 'c3', courseName: 'Computer Architecture ...', name: 'Final Exam', percentOfGrade: 10, timeSpent: 0, timeEstimated: 240, dueDate: 'Dec 25, 2:00 AM', completed: false },
  { id: 't4', courseId: 'c4', courseName: 'Introduction to Compu...', name: 'Bears Killing Tourist with Berries', percentOfGrade: 11.49, timeSpent: 10, timeEstimated: 100, dueDate: 'Nov 05, 8:00 PM', completed: true },
];

const formatTime = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) {
    return `${hrs} hr ${mins} min`;
  }
  return `${mins} min`;
};

const HomeTab = () => (
  <div className="tab-content">
    <h2>Home Dashboard</h2>
    <p>This is your main dashboard. Welcome back!</p>
  </div>
);

const TasksTab = () => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null); // null == all courses

  const filteredTasks = selectedCourseId
    ? tasks.filter(task => task.courseId === selectedCourseId)
    : tasks;

  return (
    <div className="tasks-tab-container">
      {/* profile section */}
      <section className="profile-header">
        <img
          src="https://i.imgur.com/3g7iB5W.png"
          alt="Profile"
          className="profile-avatar"
        />
        <h1 className="profile-email">catlover@gmail.com</h1>
      </section>

      {/* course filter bar */}
      <nav className="course-filter-bar">
        <button 
          className={`course-filter-btn ${selectedCourseId === null ? 'active' : ''}`}
          onClick={() => setSelectedCourseId(null)}
        >
          All Courses
        </button>
        {courses.map(course => (
          <button 
            key={course.id}
            className={`course-filter-btn ${selectedCourseId === course.id ? 'active' : ''}`}
            onClick={() => setSelectedCourseId(course.id)}
          >
            {course.name}
          </button>
        ))}
      </nav>

      {/* task list header */}
      <header className="task-list-header">
        <span className="task-col-name">Name</span>
        <span className="task-col-course">Course</span>
        <span className="task-col-grade">% of Grade</span>
        <span className="task-col-time">Time Spent</span>
        <span className="task-col-due">Due Date</span>
      </header>

      {/* task list */}
      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-col-name">
              <span className="task-checkbox"></span>
              {task.name}
            </div>
            <span className="task-col-course">{task.courseName}</span>
            <span className="task-col-grade">{task.percentOfGrade.toFixed(2)}%</span>
            <span className="task-col-time">{formatTime(task.timeSpent)} / {formatTime(task.timeEstimated)}</span>
            <span className="task-col-due">{task.dueDate}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export function HomePage() {
  const [activeTab, setActiveTab] = useState('tasks'); // defaults to tasks

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'tasks':
        return <TasksTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="app-container">
      {/* new navbar*/}
      <nav className="main-navbar">
        <div className="navbar-left">
          <span className="navbar-logo">Mnemonic</span>
        </div>
        <div className="navbar-center">
          <button 
            className={`navbar-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button 
            className={`navbar-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
        </div>
        <div className="navbar-right">
          <button className="navbar-logout-btn">
            Log Out
          </button>
        </div>
      </nav>

      <main className="main-content">
        {renderActiveTab()}
      </main>
    </div>
  );
}