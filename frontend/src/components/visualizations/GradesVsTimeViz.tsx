interface GradesVsTimeVizProps {
  courseName: string;
  isAllCourses: boolean;
}

export default function GradesVsTimeViz({ courseName, isAllCourses }: GradesVsTimeVizProps) {
  return (
    <div className="grades-vs-time-viz-container">
      <h3>Grades vs Time Visualization</h3>
      <p>
        Placeholder for {isAllCourses ? "all courses" : courseName}.
      </p>
    </div>
  );
}
