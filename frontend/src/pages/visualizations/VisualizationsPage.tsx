// frontend/src/pages/visualizations/VisualizationsPage.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { Course } from "../../../../shared/models/course";
import { getCourses } from "../../services/coursesService";
import VisualizationRenderer from "./VisualizationRenderer";
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

  // --- Handle visualization tab click ---
  const handleVisualizationTabClick = (tab: string) => {
    setSelectedVisualizationTab(tab);
    setSelectedCourseTab("All Courses"); // Reset course selection to "All Courses"
  };

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
            onClick={() => handleVisualizationTabClick(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Visualization Content */}
      <div className="visualizations-page-content">
        <VisualizationRenderer
          selectedCourse={selectedCourseTab}
          selectedTab={selectedVisualizationTab}
        />
      </div>
    </div>
  );
}

export default VisualizationsPage;
