// frontend/src/pages/visualizations/VisualizationsPage.tsx
import { useState, useEffect } from "react";

import { useAuth } from "../../hooks/useAuth";

import type { Course } from "../../../../shared/models/course";

import { getCourses } from "../../services/coursesService";

import "./VisualizationsPage.css";

const VISUALIZATION_TABS = ["Grades", "Time", "Grades vs Time"];

function VisualizationsPage() {
  const { uid } = useAuth();
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourseTab, setSelectedCourseTab] = useState("All Courses");
  const [selectedVisualizationTab, setSelectedVisualizationTab] = useState(
    VISUALIZATION_TABS[0]
  );

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

  return (
    <div className="visualizations-page">
      {/* Course Tabs (same style as TaskPage) */}
      <div className="task-page-course-cont">
        {["All Courses", ...availableCourses.map((c) => c.courseName ?? "")].map(
          (courseName, i) => (
            <div
              key={`visualizations-page-${courseName}-${i}`}
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

      {/* Secondary Visualization Tabs */}
      <div className="visualizations-page-viz-tab-cont">
        {VISUALIZATION_TABS.map((tab, i) => (
          <div
            key={`viz-tab-${i}`}
            className={`visualizations-page-viz-tab ${
              selectedVisualizationTab === tab ? "selected" : ""
            }`}
            onClick={() => setSelectedVisualizationTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Visualization Content Placeholder */}
      <div className="visualizations-page-content">
        <h2>{selectedVisualizationTab}</h2>
        <p>
          Visualizations for <b>{selectedCourseTab}</b> will appear here.
          Charts for course grades, time spent, and grade vs time can be added.
        </p>
      </div>
    </div>
  );
}

export default VisualizationsPage;
