import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

import { getCourses } from "../../services/coursesService";
import { getTasks } from "../../services/tasksService";

import TimeHistogram from "../charts/TimeHistogram";
import TimeTypeAveragesBar from "../charts/TimeTypeAveragesBar";

interface TimeVizProps {
  courseName: string;
  isAllCourses: boolean;
}

export default function TimeViz({ courseName, isAllCourses }: TimeVizProps) {
  const { uid } = useAuth();

  const [loading, setLoading] = useState(true);
  const [histogramData, setHistogramData] = useState<any[]>([]);
  const [timeTypeData, setTimeTypeData] = useState<any[]>([]);

  const [showAverage, setShowAverage] = useState(false);

  useEffect(() => {
    if (!uid) return;

    async function load(userId: string) {
      setLoading(true);

      try {
        if (isAllCourses) {
          const courses = await getCourses(userId, null);
          const formatted: any[] = [];

          for (const course of courses) {
            const tasks = await getTasks(userId, null, course.courseId);

            const totalMinutes = tasks.reduce(
              (sum, t) => sum + (t.currentTime ?? 0) * 60,
              0
            );

            formatted.push({
              courseName: course.courseName,
              minutes: totalMinutes,
            });
          }

          setHistogramData(formatted);
        } else {
          const courses = await getCourses(userId, null);
          const thisCourse = courses.find((c) => c.courseName === courseName);

          if (!thisCourse) {
            setTimeTypeData([]);
            setLoading(false);
            return;
          }

          const tasks = await getTasks(userId, null, thisCourse.courseId);

          const bucket: Record<string, number[]> = {};

          tasks.forEach((task) => {
            if (!task.gradeType) return;
            if (!bucket[task.gradeType]) bucket[task.gradeType] = [];
            bucket[task.gradeType].push((task.currentTime ?? 0) * 60);
          });

          const formatted = Object.entries(bucket)
            .map(([type, mins]) => {
              const total = mins.reduce((a, b) => a + b, 0);
              const avg = total / (mins.length === 0 ? 1 : mins.length);

              return {
                type,
                minutes: showAverage
                  ? Number(avg.toFixed(2))
                  : total,
                hasTime: total > 0,
              };
            })
            .filter((entry) => entry.hasTime);

          setTimeTypeData(formatted);
        }
      } catch (e) {
        console.error("Failed loading time visualization:", e);
      }

      setLoading(false);
    }

    load(uid);
  }, [uid, courseName, isAllCourses, showAverage]);

  if (loading) return <p>Loading time data…</p>;

  return (
    <div className="grades-viz-container" style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center", // center title
          alignItems: "center",
          marginBottom: 10,
          flexDirection: "column",
          gap: 10,
        }}
      >
        <h3>
          {isAllCourses
            ? "Time Spent Across Courses"
            : `Time Spent by Grade Type for ${courseName}`}
        </h3>

        {!isAllCourses && (
          <div
            style={{
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>Total</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={showAverage}
                onChange={() => setShowAverage(!showAverage)}
              />
              <span className="slider round"></span>
            </label>
            <span>Average</span>
          </div>
        )}
      </div>

      {isAllCourses ? (
        <TimeHistogram data={histogramData} />
      ) : (
        <TimeTypeAveragesBar data={timeTypeData} showAverage={showAverage} />
      )}
    </div>
  );
}
