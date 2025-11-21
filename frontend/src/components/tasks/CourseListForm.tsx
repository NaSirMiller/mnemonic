import { useState, useEffect } from "react";
import "../tasks/EditCourse/EditCourse.css";
import type { Course } from "../../../../shared/models/course";
import {
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../services/coursesService";

interface CourseListFormProps {
  userId: string;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  onCoursesChanged?: () => void;
}

export function CourseListForm({
  userId,
  selectedCourse,
  setSelectedCourse,
  onCoursesChanged,
}: CourseListFormProps) {
  const [courseName, setCourseName] = useState("");
  const [courseGrade, setCourseGrade] = useState("");
  const [courseGradeWeights, setCourseGradeWeights] = useState<
    Record<string, number>
  >({});
  const [gradeOrder, setGradeOrder] = useState<string[]>([]);
  const [tempGradeInputs, setTempGradeInputs] = useState<
    Record<string, string>
  >({});
  const [courseNameError] = useState("");
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState("");
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");

  // Populate form when selectedCourse changes
  useEffect(() => {
    if (!selectedCourse) {
      setCourseName("");
      setCourseGrade("");
      setCourseGradeWeights({});
      setGradeOrder([]);
      setTempGradeInputs({});
      return;
    }

    setCourseName(selectedCourse.courseName ?? "");
    setCourseGrade(((selectedCourse.currentGrade ?? 0) * 100).toFixed(2));

    const weightsPercent: Record<string, number> = {};
    const gradeTypes = selectedCourse.gradeTypes ?? {};
    for (const [k, v] of Object.entries(gradeTypes)) {
      weightsPercent[k] = v * 100;
    }

    setCourseGradeWeights(weightsPercent);
    setGradeOrder(
      Object.keys(weightsPercent).sort((a, b) => {
        const wA = weightsPercent[a],
          wB = weightsPercent[b];
        if (wB !== wA) return wB - wA;
        return a.localeCompare(b);
      })
    );
  }, [selectedCourse]);

  const buildPayload = (): Course => ({
    courseName,
    currentGrade: (parseFloat(courseGrade) || 0) / 100,
    gradeTypes: Object.fromEntries(
      Object.entries(courseGradeWeights).map(([k, v]) => [k.trim(), v / 100])
    ),
    userId,
  });

  const handleGradeWeightChange = (
    oldGrade: string,
    newGrade: string,
    newWeight?: number
  ) => {
    setCourseGradeWeights((prev) => {
      const updated = { ...prev };
      if (newGrade !== oldGrade) {
        updated[newGrade] = newWeight ?? updated[oldGrade] ?? 0;
        delete updated[oldGrade];
        setGradeOrder((prevOrder) =>
          prevOrder.map((g) => (g === oldGrade ? newGrade : g))
        );
      } else if (newWeight !== undefined) {
        updated[oldGrade] = newWeight;
      }
      return updated;
    });
  };

  const reorderGrades = () => {
    setGradeOrder((prevOrder) =>
      [...prevOrder].sort((a, b) => {
        const wA = courseGradeWeights[a],
          wB = courseGradeWeights[b];
        if (wB !== wA) return wB - wA;
        return a.localeCompare(b);
      })
    );
  };

  const handleNewGradeWeight = () => {
    const baseName = "New Grade";
    let newName = baseName;
    let counter = 1;
    while (courseGradeWeights[newName] !== undefined)
      newName = `${baseName} ${counter++}`;
    setCourseGradeWeights((prev) => ({ ...prev, [newName]: 0 }));
    setGradeOrder((prev) => [...prev, newName]);
  };

  const submitForm = async (): Promise<Course | undefined> => {
    if (!courseName.trim()) return;

    const payload = buildPayload();

    try {
      let createdCourse: Course;
      if (!selectedCourse) {
        createdCourse = await createCourse(payload);
        setSelectedCourse(createdCourse);
      } else {
        await updateCourse(userId, selectedCourse.courseId!, payload);
        createdCourse = { ...selectedCourse, ...payload };
        setSelectedCourse(createdCourse);
      }

      setSubmitSuccessMsg("Course submitted!");
      setTimeout(() => setSubmitSuccessMsg(""), 2000);
      onCoursesChanged?.();

      return createdCourse;
    } catch (err) {
      console.error("Error submitting course:", err);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse?.courseId) return;

    try {
      await deleteCourse(userId, selectedCourse.courseId);
      onCoursesChanged?.();
      setSelectedCourse(null);
      setDeleteSuccessMsg("Course deleted!");
      setTimeout(() => setDeleteSuccessMsg(""), 2000);
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  return (
    <div className="edit-course">
      {/* Course Form */}
      <div className="edit-course-form">
        <div className="edit-course-section-title">Course Name*</div>
        <input
          className="edit-course-text-input"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        {courseNameError && (
          <div className="edit-course-error">{courseNameError}</div>
        )}

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
          <div className="edit-course-label-cont">
            <div className="edit-course-label-name">Name</div>
            <div className="edit-course-label-final-grade">
              % of Final Grade
            </div>
          </div>

          <div className="edit-course-course-card-cont">
            {gradeOrder.map((grade, i) => (
              <div key={i} className="edit-course-course-card">
                <input
                  className="edit-course-course-card-name"
                  value={grade}
                  onChange={(e) =>
                    handleGradeWeightChange(grade, e.target.value)
                  }
                />
                <input
                  type="number"
                  step="0.01"
                  className="edit-course-course-card-final-grade"
                  value={
                    tempGradeInputs[grade] ??
                    courseGradeWeights[grade]?.toString() ??
                    ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setTempGradeInputs((prev) => ({ ...prev, [grade]: val }));
                    if (val === "") return;
                    handleGradeWeightChange(grade, grade, Number(val));
                  }}
                  onKeyDown={(e) => e.key === "Enter" && reorderGrades()}
                />
              </div>
            ))}
            <div
              className="edit-course-course-card"
              onClick={handleNewGradeWeight}
            >
              <div className="edit-course-course-card-name">
                Add Grade Type (ex. Text, Project)
              </div>
              <div className="edit-course-course-card-final-grade">0</div>
              <div className="edit-course-dark-card"></div>
            </div>
          </div>
        </div>

        <div className="edit-course-submit-course" onClick={submitForm}>
          Submit Course
        </div>
        {submitSuccessMsg && (
          <div className="edit-course-success-popup">{submitSuccessMsg}</div>
        )}

        {selectedCourse && (
          <div
            className="edit-course-delete-course"
            onClick={handleDeleteCourse}
          >
            Delete Course
          </div>
        )}
        {deleteSuccessMsg && (
          <div className="edit-course-success-popup">{deleteSuccessMsg}</div>
        )}
      </div>
    </div>
  );
}
