import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

import { getCourses } from "../../services/coursesService";
import { getTasks } from "../../services/tasksService";

import GradesVsTimeScatter from "../charts/GradesVsTimeScatter";

interface GradesVsTimeVizProps {
  courseName: string;
  isAllCourses: boolean;
}

export default function GradesVsTimeViz({
  courseName,
  isAllCourses,
}: GradesVsTimeVizProps) {
  const { uid } = useAuth();

  const [loading, setLoading] = useState(true);
  const [scatterData, setScatterData] = useState<any[]>([]);

  // Compute completeness percentage
  const computeCompleteness = (spent: number, expected: number) => {
    if (!expected || expected <= 0) return 0;
    const val = (spent / expected) * 100;
    return Math.min(val, 200);
  };

  useEffect(() => {
    if (!uid) return;

    async function load(userId: string) {
      setLoading(true);

      try {
        const courses = await getCourses(userId, null);

        if (isAllCourses) {
          // All courses
          const allTasks: any[] = [];

          for (const course of courses) {
            const tasks = await getTasks(userId, null, course.courseId);

            tasks.forEach((t) => {
              if (
                t.isComplete &&
                typeof t.grade === "number" &&
                typeof t.currentTime === "number" &&
                t.expectedTime
              ) {
                allTasks.push({
                  name: `${course.courseName} – ${t.title || "Task"}`,
                  grade: Number((t.grade * 100).toFixed(2)),
                  timeCompleteness: Number(
                    computeCompleteness(t.currentTime, t.expectedTime).toFixed(2)
                  ),
                });
              }
            });
          }

          setScatterData(allTasks);
        } else {
          // Specific course
          const thisCourse = courses.find((c) => c.courseName === courseName);

          if (!thisCourse) {
            setScatterData([]);
            setLoading(false);
            return;
          }

          const tasks = await getTasks(userId, null, thisCourse.courseId);

          const completed = tasks.filter(
            (t) =>
              t.isComplete &&
              typeof t.grade === "number" &&
              t.currentTime !== undefined &&
              t.currentTime > 0 &&
              t.expectedTime
          );

          const formatted = completed.map((t) => ({
            name: t.title || "Task",
            grade: Number((t.grade! * 100).toFixed(2)),
            timeCompleteness: Number(
              computeCompleteness(t.currentTime!, t.expectedTime!).toFixed(2)
            ),
          }));

          setScatterData(formatted);
        }
      } catch (err) {
        console.error("Error loading Grades vs Time data:", err);
      }

      setLoading(false);
    }

    load(uid);
  }, [uid, courseName, isAllCourses]);

  if (loading) return <p>Loading data…</p>;

  return (
    <div className="grades-vs-time-viz-container" style={{ width: "100%" }}>
      {/* Title section */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginBottom: 10,
          gap: 5,
          textAlign: "center",
        }}
      >
        <h3 style={{ margin: 0 }}>
          Grades vs Time Completeness{" "}
          {isAllCourses ? "(All Courses)" : `– ${courseName}`}
        </h3>
        <p style={{ margin: 0, fontSize: 14 }}>
          <strong>Time Completeness = (Time Spent / Expected Time) × 100</strong>
        </p>
      </div>

      {/* Chart section */}
      {scatterData.length === 0 ? (
        <p style={{ textAlign: "center" }}>No completed tasks with time data yet.</p>
      ) : (
        <div style={{ width: 650, height: 350, margin: "0 auto" }}>
          <GradesVsTimeScatter data={scatterData} />
        </div>
      )}
    </div>
  );
}
