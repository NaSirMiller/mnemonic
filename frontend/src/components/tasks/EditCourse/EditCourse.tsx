import { useState, useEffect, useContext } from "react";
import "./EditCourse.css";
import { createCourse, updateCourse, deleteCourse, getCourses } from "../../../services/coursesService";
import type { Course } from "../../../../../shared/models/course";
import { AuthContext } from "../../context/AuthContext";

interface EditCourseProps {
  onCoursesChanged?: () => void;
}

function EditCourse({ onCoursesChanged }: EditCourseProps) {
  const auth = useContext(AuthContext);
  const userId = auth?.uid;

  const [courseName, setCourseName] = useState<string>("");
  const [courseGrade, setCourseGrade] = useState<string>("");
  const [courseGradeWeights, setCourseGradeWeights] = useState<Record<string, number>>({});
  const [courseNameError, setCourseNameError] = useState<string>("");

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [gradeOrder, setGradeOrder] = useState<string[]>([]);

  const [tempGradeInputs, setTempGradeInputs] = useState<Record<string, string>>({});


  const buildCoursePayload = (): Course => {
    if (!userId) throw new Error("User ID not available");

    const filteredGradeTypes: Record<string, number> = {};
    Object.entries(courseGradeWeights).forEach(([k, v]) => {
      if (k.trim() !== "") filteredGradeTypes[k.trim()] = v / 100;
    });

    return {
      courseName,
      currentGrade: (parseFloat(courseGrade) || 0) / 100,
      gradeTypes: filteredGradeTypes,
      userId,
    };
  };

  // Fetch courses on load
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const fetchedCourses = await getCourses(userId, null);
        setCourses(fetchedCourses);
        if (fetchedCourses.length > 0) selectCourse(fetchedCourses[0]);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    })();
  }, [userId]);

    const selectCourse = (course: Course) => {
    setSelectedCourse(course);
    setCourseName(course.courseName ?? "");
    setCourseGrade(((course.currentGrade ?? 0) * 100).toFixed(2));

    const gradeTypesPercent: Record<string, number> = {};
    const gradeTypes = course.gradeTypes ?? {}; // <-- fallback
    for (const [k, v] of Object.entries(gradeTypes)) {
        gradeTypesPercent[k] = v * 100;
    }

    setCourseGradeWeights(gradeTypesPercent);
    setGradeOrder(Object.keys(gradeTypesPercent).sort((a, b) => {
        const wA = gradeTypesPercent[a];
        const wB = gradeTypesPercent[b];
        if (wB !== wA) return wB - wA;
        return a.localeCompare(b);
    }));
    };


  const handleSelectCourse = (courseName: string) => {
    const course = courses.find(c => c.courseName === courseName);
    if (course) selectCourse(course);
  };

  const handleNewCourse = async () => {
    if (!userId) return console.warn("User not logged in.");

    let baseName = "New Course";
    let newName = baseName;
    let counter = 1;
    const existingNames = new Set(courses.map(c => c.courseName));
    while (existingNames.has(newName)) {
      newName = `${baseName} ${counter}`;
      counter++;
    }

    const newCourse: Course = {
      courseName: newName,
      currentGrade: 0,
      gradeTypes: {},
      userId,
    };

    try {
      await createCourse(newCourse);
      const refreshedCourses = await getCourses(userId, null);
      setCourses(refreshedCourses);

      // Automatically select the newly created course
      const newlyCreated = refreshedCourses.find(c => c.courseName === newName);
      if (newlyCreated) selectCourse(newlyCreated);

      if (onCoursesChanged) onCoursesChanged();
    } catch (err) {
      console.error("Failed to create new course:", err);
    }
  };


  const handleNewGradeWeight = () => {
    const baseName = "New Grade";
    let newName = baseName;
    let counter = 1;
    while (courseGradeWeights[newName] !== undefined) newName = `${baseName} ${counter++}`;
    setCourseGradeWeights(prev => ({ ...prev, [newName]: 0 }));
    setGradeOrder(prev => [...prev, newName]);
  };

  const reorderGrades = () => {
    setGradeOrder(prevOrder =>
      [...prevOrder].sort((a, b) => {
        const wA = courseGradeWeights[a];
        const wB = courseGradeWeights[b];
        if (wB !== wA) return wB - wA;
        return a.localeCompare(b);
      })
    );
  };

  const handleGradeWeightChange = (oldGrade: string, newGrade: string, newWeight?: number) => {
    setCourseGradeWeights(prev => {
      const updated = { ...prev };
      if (newGrade !== oldGrade) {
        const weightValue = newWeight ?? updated[oldGrade] ?? 0;
        delete updated[oldGrade];
        updated[newGrade] = weightValue;
        setGradeOrder(prevOrder => prevOrder.map(g => g === oldGrade ? newGrade : g));
      } else if (newWeight !== undefined) {
        updated[oldGrade] = newWeight;
      }
      return updated;
    });
  };

  const submitForm = async () => {
    if (!userId || !courseName.trim()) return;

    try {
      const payload = buildCoursePayload();

      const nameTaken = courses.some(
        c => c.courseName === courseName && c.courseId !== selectedCourse?.courseId
      );
      if (nameTaken) {
        setCourseNameError("Course name taken!");
        if (selectedCourse) selectCourse(selectedCourse);
        return;
      } else setCourseNameError("");

      if (!selectedCourse) {
        const created = await createCourse(payload);
        const refreshedCourses = await getCourses(userId, null);
        setCourses(refreshedCourses);
        selectCourse(created);
        if (onCoursesChanged) onCoursesChanged();
      } else if (selectedCourse.courseId) {
        await updateCourse(userId, selectedCourse.courseId, payload);
        const refreshedCourses = await getCourses(userId, null);
        setCourses(refreshedCourses);
        const reselected = refreshedCourses.find(c => c.courseId === selectedCourse.courseId);
        if (reselected) selectCourse(reselected);
        if (onCoursesChanged) onCoursesChanged();
      }

    } catch (err) {
      console.error("Error writing course:", err);
    }
  };

    const handleDeleteCourse = async () => {
        if (!userId || !selectedCourse || !selectedCourse.courseId) return;

        try {
            await deleteCourse(userId, selectedCourse.courseId);

            // Call parent refresh first
            if (onCoursesChanged) onCoursesChanged();

            // Update local state
            const remainingCourses = courses.filter(c => c.courseId !== selectedCourse.courseId);
            setCourses(remainingCourses);

            if (remainingCourses.length > 0) {
            selectCourse(remainingCourses[0]);
            } else {
            setSelectedCourse(null);
            setCourseName("");
            setCourseGrade("");
            setCourseGradeWeights({});
            setGradeOrder([]);
            }

        } catch (err) {
            console.error("Failed to delete course:", err);
        }
    };



  return (
    <div className="edit-course" onClick={e => e.stopPropagation()}>
      <div className="edit-course-title">Edit Courses</div>

      <div className="edit-course-course-cont">
        {courses.map((course, i) => (
          <div
            key={`edit-course-${course.courseName}-${i}`}
            className={`edit-course-course ${selectedCourse?.courseName === course.courseName ? "selected" : ""}`}
            onClick={() => handleSelectCourse(course.courseName!)}
          >
            {course.courseName}
          </div>
        ))}
        <div className="edit-course-course-add" onClick={handleNewCourse}>Add Course</div>
      </div>

      <div className="edit-course-section-title">Course Name*</div>
      <input
        name="courseName"
        className="edit-course-text-input"
        value={courseName}
        onChange={e => setCourseName(e.target.value)}
      />
      {courseNameError && <div className="edit-course-error">{courseNameError}</div>}

      <div className="edit-course-section-title">Course Grade</div>
      <div className="edit-course-input-cont">
        <input
          type="number"
          step="0.01"
          name="courseGrade"
          className="edit-course-text-input"
          value={courseGrade}
          onChange={e => setCourseGrade(e.target.value)}
        />
        <div className="edit-course-right-icon">%</div>
      </div>

      <div className="edit-course-section-title">Grade Weighting</div>
      <div className="edit-course-grade-weight-cont">
        <div className="edit-course-label-cont">
          <div className="edit-course-label-name">Name</div>
          <div className="edit-course-label-final-grade">% of Final Grade</div>
        </div>

        <div className="edit-course-course-card-cont">
          {gradeOrder.map((grade, i) => (
            <div key={`edit-course-course-card-${i}`} className="edit-course-course-card">
              <input
                className="edit-course-course-card-name"
                value={grade}
                onChange={e => handleGradeWeightChange(grade, e.target.value)}
              />
              <input
                className="edit-course-course-card-final-grade"
                type="number"
                step="0.01"
                value={tempGradeInputs[grade] ?? courseGradeWeights[grade]?.toString() ?? ""}
                onChange={e => {
                    const val = e.target.value;
                    setTempGradeInputs(prev => ({ ...prev, [grade]: val }));
                    if (val === "") return; 
                    handleGradeWeightChange(grade, grade, Number(val));
                }}
                onKeyDown={e => e.key === "Enter" && reorderGrades()}
                />
            </div>
          ))}
          <div className="edit-course-course-card" onClick={handleNewGradeWeight}>
            <div className="edit-course-course-card-name">Add Grade Type (ex. Text, Project)</div>
            <div className="edit-course-course-card-final-grade">0</div>
            <div className="edit-course-dark-card"></div>
          </div>
        </div>
      </div>

      <div className="edit-course-submit-course" onClick={submitForm}>Submit Course</div>
      <div className="edit-course-delete-course" onClick={handleDeleteCourse}>Delete Course</div>
    </div>
  );
}

export default EditCourse;
