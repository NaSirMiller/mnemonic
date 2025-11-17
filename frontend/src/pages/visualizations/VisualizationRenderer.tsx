// src/pages/visualizations/VisualizationRenderer.tsx

import GradesViz from "../../components/visualizations/GradesViz";
import TimeViz from "../../components/visualizations/TimeViz";
import GradesVsTimeViz from "../../components/visualizations/GradesVsTimeViz";

interface VisualizationRendererProps {
  selectedCourse: string;
  selectedTab: string;
}

export default function VisualizationRenderer({
  selectedCourse,
  selectedTab,
}: VisualizationRendererProps) {
  // Optional: "All Courses" visualization behavior
  const isAll = selectedCourse === "All Courses";

  // Render based on active visualization tab
  switch (selectedTab) {
    case "Grades":
      return (
        <div className="visualizations-renderer">
          <GradesViz courseName={selectedCourse} isAllCourses={isAll} />
        </div>
      );

    case "Time":
      return (
        <div className="visualizations-renderer">
          <TimeViz courseName={selectedCourse} isAllCourses={isAll} />
        </div>
      );

    case "Grades vs Time":
      return (
        <div className="visualizations-renderer">
          <GradesVsTimeViz courseName={selectedCourse} isAllCourses={isAll} />
        </div>
      );

    default:
      return (
        <div className="visualizations-renderer">
          <p>No visualization selected.</p>
        </div>
      );
  }
}
