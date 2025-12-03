import type { Course } from "../../../../../shared/models/course";
import { useAuth } from "../../../hooks/useAuth";
import "./CourseForm.css";

interface CourseFormProps {
  course: Course;
  onChange: (coursePayload: Course) => void;
}

export function CourseForm({ course, onChange }: CourseFormProps) {
  const { uid } = useAuth();

  const update = (patch: Partial<Course>) => {
    onChange({
      ...course,
      ...patch,
      userId: uid!,
    });
  };

  const gradeTypes = course.gradeTypes ?? {};
  const gradeOrder = Object.keys(gradeTypes);

  const handleRenameGrade = (oldName: string, newName: string) => {
    if (!newName.trim()) return;

    const updated: Record<string, number> = {};
    for (const [key, value] of Object.entries(gradeTypes)) {
      updated[key === oldName ? newName : key] = value;
    }

    update({ gradeTypes: updated });
  };

  const handleChangeWeight = (name: string, newValue: number) => {
    update({
      gradeTypes: {
        ...gradeTypes,
        [name]: newValue / 100,
      },
    });
  };

  const handleAddGradeType = () => {
    const base = "New Grade";
    let name = base;
    let i = 1;
    while (gradeTypes[name] !== undefined) {
      name = `${base} ${i++}`;
    }

    update({
      gradeTypes: {
        ...gradeTypes,
        [name]: 0, // store fraction internally
      },
    });
  };

  return (
    <div className="course-form-container">
      <div className="course-form-title">Course Form</div>

      <div className="course-form-section-title">Course Name*</div>
      <input
        className="course-form-text-input"
        value={course.courseName ?? ""}
        onChange={(e) => update({ courseName: e.target.value })}
      />

      <div className="course-form-section-title">Current Grade</div>
      <div className="course-form-input-container">
        <input
          type="number"
          step="0.01"
          className="course-form-text-input"
          value={((course.currentGrade ?? 0) * 100).toFixed(2)}
          onChange={(e) =>
            update({ currentGrade: Number(e.target.value) / 100 })
          }
        />
        <div className="course-form-right-icon">%</div>
      </div>

      <div className="course-form-section-title">Grade Weighting</div>

      <div className="course-form-grade-weight-container">
        {gradeOrder.map((gradeName) => (
          <div key={gradeName} className="course-form-grade-card">
            {/* Grade name */}
            <input
              className="course-form-grade-card-name"
              value={gradeName}
              onChange={(e) => handleRenameGrade(gradeName, e.target.value)}
            />

            {/* Weight (percent) */}
            <input
              type="number"
              step="0.01"
              className="course-form-grade-card-weight"
              value={(gradeTypes[gradeName] * 100).toFixed(2)}
              onChange={(e) =>
                handleChangeWeight(gradeName, Number(e.target.value))
              }
            />
          </div>
        ))}

        {/* Add new grade type */}
        <div className="course-form-grade-card" onClick={handleAddGradeType}>
          <div className="course-form-grade-card-name">
            Add Grade Type (ex. Exam, HW)
          </div>
          <div className="course-form-grade-card-weight">0%</div>
        </div>
      </div>
    </div>
  );
}
