import { useState, useEffect, useCallback } from "react";
import "./EditCourse/EditCourse.css";

import type { Course } from "../../../../shared/models/course";
interface CourseFormProps {
  course?: Course | null;
  onChange?: (coursePayload: Course) => void; // optional callback for parent
}

export function CourseForm({ course, onChange }: CourseFormProps) {
  const [courseName, setCourseName] = useState("");
  const [courseGrade, setCourseGrade] = useState(""); // %
  const [gradeWeights, setGradeWeights] = useState<Record<string, number>>({});
  const [gradeOrder, setGradeOrder] = useState<string[]>([]);
  const [tempInputs, setTempInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!course) return;
    setCourseName(course.courseName ?? "");
    setCourseGrade(((course.currentGrade ?? 0) * 100).toFixed(2));

    const weightsPercent: Record<string, number> = {};
    for (const [k, v] of Object.entries(course.gradeTypes ?? {})) {
      weightsPercent[k] = v * 100;
    }
    setGradeWeights(weightsPercent);
    setGradeOrder(Object.keys(weightsPercent));
  }, [course]);

  const handleAddGrade = () => {
    const base = "New Grade";
    let name = base;
    let i = 1;
    while (gradeWeights[name] !== undefined) {
      name = `${base} ${i++}`;
    }
    setGradeWeights((p) => ({ ...p, [name]: 0 }));
    setGradeOrder((p) => [...p, name]);
  };

  const handleWeightChange = (
    oldName: string,
    newName: string,
    newValue?: number
  ) => {
    setGradeWeights((prev) => {
      const next = { ...prev };
      if (newName !== oldName) {
        const oldValue = newValue ?? next[oldName] ?? 0;
        delete next[oldName];
        next[newName] = oldValue;
        setGradeOrder((o) => o.map((g) => (g === oldName ? newName : g)));
      } else if (newValue !== undefined) {
        next[oldName] = newValue;
      }
      return next;
    });
  };

  const buildPayload = useCallback((): Course => {
    const filtered: Record<string, number> = {};
    for (const [k, v] of Object.entries(gradeWeights)) {
      if (k.trim()) filtered[k.trim()] = v / 100;
    }
    return {
      courseName,
      currentGrade: (parseFloat(courseGrade) || 0) / 100,
      gradeTypes: filtered,
    } as Course;
  }, [courseName, courseGrade, gradeWeights]);

  useEffect(() => {
    if (onChange) onChange(buildPayload());
  }, [buildPayload, onChange]);

  return (
    <div className="edit-course">
      <div className="edit-course-title">Course Form</div>

      <div className="edit-course-section-title">Course Name*</div>
      <input
        className="edit-course-text-input"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />

      <div className="edit-course-section-title">Course Grade</div>
      <div className="edit-course-input-cont">
        <input
          type="number"
          step="0.01"
          className="edit-course-text-input"
          value={courseGrade}
          onChange={(e) => setCourseGrade(e.target.value)}
        />
        <div className="edit-course-right-icon">%</div>
      </div>

      <div className="edit-course-section-title">Grade Weighting</div>
      <div className="edit-course-grade-weight-cont">
        {gradeOrder.map((g) => (
          <div key={g} className="edit-course-course-card">
            <input
              className="edit-course-course-card-name"
              value={g}
              onChange={(e) => handleWeightChange(g, e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              className="edit-course-course-card-final-grade"
              value={tempInputs[g] ?? gradeWeights[g]?.toString() ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setTempInputs((p) => ({ ...p, [g]: val }));
                if (val !== "") handleWeightChange(g, g, Number(val));
              }}
            />
          </div>
        ))}

        <div className="edit-course-course-card" onClick={handleAddGrade}>
          <div className="edit-course-course-card-name">
            Add Grade Type (ex. Exam, HW)
          </div>
          <div className="edit-course-course-card-final-grade">0</div>
        </div>
      </div>
    </div>
  );
}
