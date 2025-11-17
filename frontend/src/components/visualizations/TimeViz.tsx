interface TimeVizProps {
  courseName: string;
  isAllCourses: boolean;
}

export default function TimeViz({ courseName, isAllCourses }: TimeVizProps) {
  return (
    <div className="time-viz-container">
      <h3>Time Visualization</h3>
      <p>
        Placeholder for {isAllCourses ? "all courses" : courseName}.
      </p>
    </div>
  );
}
