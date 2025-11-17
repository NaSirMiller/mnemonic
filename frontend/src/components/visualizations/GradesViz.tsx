import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

import { getCourses } from "../../services/coursesService";
import { getTasks } from "../../services/tasksService";

import GradeHistogram from "../charts/GradeHistogram";
import GradeTypeAveragesBar from "../charts/GradeTypeAveragesBar";

interface GradesVizProps {
  courseName: string;
  isAllCourses: boolean;
}

export default function GradesViz({ courseName, isAllCourses }: GradesVizProps) {
  const { uid } = useAuth();

  const [loading, setLoading] = useState(true);
  const [histogramData, setHistogramData] = useState<any[]>([]);
  const [gradeTypeData, setGradeTypeData] = useState<any[]>([]);

  useEffect(() => {
    if (!uid) return;

    async function load(userId: string) {
      setLoading(true);

      try {
        if (isAllCourses) {
            const courses = await getCourses(userId, null);
            const formatted = courses.map((c) => ({
              courseName: c.courseName,
              grade: ((c as any).currentGrade ?? 0) * 100, // multiply by 100
            }));
            setHistogramData(formatted);
            } else {
            const courses = await getCourses(userId, null);
            const thisCourse = courses.find((c) => c.courseName === courseName);
            if (!thisCourse) {
                setGradeTypeData([]);
                setLoading(false);
                return;
            }

            const tasks = await getTasks(userId, null, thisCourse.courseId);

            const completed = tasks.filter(
                (t) => t.isComplete && t.gradeType && typeof t.grade === "number"
            );

            const bucket: Record<string, number[]> = {};

            completed.forEach((task) => {
                if (!task.gradeType) return; // prevent undefined key
                if (!bucket[task.gradeType]) bucket[task.gradeType] = [];
                bucket[task.gradeType].push(task.grade!);
            });

            const formatted = Object.entries(bucket).map(([type, grades]) => ({
              type,
              avg:
                (grades.reduce((a, b) => a + b, 0) / (grades.length === 0 ? 1 : grades.length)) * 100, // multiply by 100
            }));
            setGradeTypeData(formatted);
            }

      } catch (err) {
        console.error("Error loading grade data:", err);
      }

      setLoading(false);
    }

    load(uid);
  }, [uid, courseName, isAllCourses]);

  if (loading) return <p>Loading grade data…</p>;

  if (isAllCourses) {
    return (
      <div className="grades-viz-container">
        <h3>Overall Course Grades</h3>
        <GradeHistogram data={histogramData} />
      </div>
    );
  }

  return (
    <div className="grades-viz-container">
      <h3>Average Grade by Grade Type for: {courseName}</h3>
      {gradeTypeData.length === 0 ? (
        <p>No completed graded tasks yet.</p>
      ) : (
        <GradeTypeAveragesBar data={gradeTypeData} />
      )}
    </div>
  );
}
