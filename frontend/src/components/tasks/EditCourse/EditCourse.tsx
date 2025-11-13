import { useState, useEffect, useContext } from "react";
import "./EditCourse.css";
import { createCourse, updateCourse, deleteCourse, getCourses } from "../../../services/coursesService";
import type { Course } from "../../../../../shared/models/course";
import { AuthContext } from "../../context/AuthContext";


function EditCourse() {   
    const auth = useContext(AuthContext);
    const userId = auth?.uid;
    // form data
    const [ courseName, setCourseName ] = useState<string>( "" );
    const [ courseGrade, setCourseGrade ] = useState<string>( "" );
    const [ courseGradeWeights, setCourseGradeWeights ] = useState<Record<string, number>>( { } );

    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const [gradeOrder, setGradeOrder] = useState<string[]>([]);

    function buildCoursePayload(): Course {
        return {
        courseName,
        currentGrade: parseFloat(courseGrade) || 0,
        gradeTypes: courseGradeWeights,
        };
    }

  // Fetch user courses on load
    useEffect(() => {
        if (!userId) return;

        (async () => {
        try {
            const fetchedCourses = await getCourses(userId, null);
            setCourses(fetchedCourses);

            if (fetchedCourses.length > 0) {
            const first = fetchedCourses[0];
            setSelectedCourse(first);
            setCourseName(first.courseName ?? "");
            setCourseGrade(first.currentGrade?.toString() ?? "");
            setCourseGradeWeights(first.gradeTypes);

            const grades = Object.keys(first.gradeTypes).sort((a, b) => {
                const wA = first.gradeTypes[a];
                const wB = first.gradeTypes[b];
                if (wA !== wB) return wB - wA;
                return a.localeCompare(b);
            });
            setGradeOrder(grades);
            }
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
        })();
    }, [userId]);

    // When user selects a different course
    const handleSelectCourse = (courseName: string) => {
        const course = courses.find((c) => c.courseName === courseName);
        if (course) {
        setSelectedCourse(course);
        setCourseName(course.courseName ?? "");
        setCourseGrade(course.currentGrade?.toString() ?? "");
        setCourseGradeWeights(course.gradeTypes);

        const grades = Object.keys(course.gradeTypes).sort((a, b) => {
            const wA = course.gradeTypes[a];
            const wB = course.gradeTypes[b];
            if (wA !== wB) return wB - wA;
            return a.localeCompare(b);
        });
        setGradeOrder(grades);
        }
    };


    const handleNewCourse = async () => {
        if (!userId) return console.warn("User not logged in.");

        const newCourse: Course = {
            courseName: "New Course",
            currentGrade: 0,
            gradeTypes: {},
            userId,
        };

        try {
            const created = await createCourse(newCourse);
            const refreshedCourses = await getCourses(userId, null);
            setCourses(refreshedCourses);

            // Select the new course immediately
            setSelectedCourse(created);
            setCourseName(created.courseName ?? "");
            setCourseGrade(created.currentGrade?.toString() ?? "");
            setCourseGradeWeights(created.gradeTypes);

            // Compute grade order for the UI
            const grades = Object.keys(created.gradeTypes).sort((a, b) => {
                const wA = created.gradeTypes[a];
                const wB = created.gradeTypes[b];
                if (wA !== wB) return wB - wA;
                return a.localeCompare(b);
            });
            setGradeOrder(grades);

            console.log("Created new blank course:", created.courseName);
        } catch (err) {
            console.error("Failed to create new course:", err);
        }
    };

    const handleNewGradeWeight = () => {
        setCourseGradeWeights((prev) => ({
        ...prev,
        "": 0,
        }));

        setGradeOrder((prev) => [...prev, ""]);
        reorderGrades();
    };


    const reorderGrades = () => {
        setGradeOrder( ( prevOrder ) => {
            return [ ...prevOrder ].sort( ( a, b ) => {
                const wA = courseGradeWeights[ a ];
                const wB = courseGradeWeights[ b ];
                if ( wB !== wA )
                    return wB - wA;
                return a.localeCompare( b );
            });
        });
    };

    const handleGradeWeightChange = (
        oldGrade: string,
        newGrade: string,
        newWeight?: number
    ) => {
        setCourseGradeWeights( ( prev ) => {
            const updated = { ...prev };

            if ( newGrade !== oldGrade ) {
                const weightValue = newWeight ?? updated[ oldGrade ] ?? 0;
                delete updated[ oldGrade ];
                updated[ newGrade ] = weightValue;
                setGradeOrder( prevOrder => prevOrder.map( g => ( g === oldGrade ? newGrade : g ) ) );
            } else if ( newWeight !== undefined ) {
                updated[ oldGrade ] = newWeight;
            }
            return updated;
        });
    };

    const submitForm = async () => {
        if (!userId) return console.warn("User not logged in.");
        if (!courseName.trim()) return;

        try {
            const payload = buildCoursePayload();
            const existing = courses.find((c) => c.courseName === selectedCourse?.courseName);

            if (!existing) {
                const created = await createCourse(payload);
                setCourses((prev) => [...prev, created]);
                setSelectedCourse(created);
                console.log("Created new course:", created.courseName);
            } else {
                if (!existing?.courseName) return console.error("No course name to update.");
                await updateCourse(userId, existing.courseName, payload);
                console.log("Updated course:", existing.courseName);
            }
        } catch (err) {
        console.error("Error writing course:", err);
        }
    };

    const handleDeleteCourse = async () => {
        if (!userId || !selectedCourse) return;
        try {
            if (!selectedCourse?.courseName) return console.error("No course selected.");
            await deleteCourse(userId, selectedCourse.courseName);
            setCourses((prev) => prev.filter((c) => c.courseName !== selectedCourse.courseName));
            setSelectedCourse(null);
            setCourseName("");
            setCourseGrade("");
            setCourseGradeWeights({});
            setGradeOrder([]);
            console.log("Deleted course:", selectedCourse.courseName);
        } catch (err) {
            console.error("Failed to delete course:", err);
        }
    };

    return (
        <div className="edit-course" onClick={ (e) => e.stopPropagation() }>
            <div className="edit-course-title">
                Edit Courses
            </div>

            <div className="edit-course-course-cont">
                { courses.map( ( course, i ) => ( 
                    <div 
                        key={`edit-course-${course.courseName}-${i}`}
                        className={`edit-course-course ${
                        selectedCourse?.courseName === course.courseName ? "selected" : ""
                        }`}
                        onClick={() => course.courseName && handleSelectCourse(course.courseName)}
                    >
                        {course.courseName}
                    </div>
                ) ) }
                <div className="edit-course-course-add" onClick={ () => handleNewCourse() }>
                    Add Course
                </div>
            </div>
            <div className="edit-course-section-title">
                Course Name*
            </div>
            <input 
                name="courseName" 
                className="edit-course-text-input"
                value={ courseName }
                onChange={ ( e ) => setCourseName( e.target.value ) }
            />
            <div className="edit-course-section-title">
                Course Grade
            </div>
            <div className="edit-course-input-cont">
                <input 
                    type="number"
                    step="0.01"
                    name="courseGrade"
                    className="edit-course-text-input"
                    value={ courseGrade }
                    onChange={ ( e ) => setCourseGrade( e.target.value ) }
                />
                <div className="edit-course-right-icon">
                    %
                </div>
            </div>
            <div className="edit-course-section-title">
                Grade Weighting
            </div>
            <div className="edit-course-grade-weight-cont">
                <div className="edit-course-label-cont">
                    <div className="edit-course-label-name">
                        Name
                    </div>
                    <div className="edit-course-label-final-grade">
                        % of Final Grade
                    </div>
                </div>
                <div className="edit-course-course-card-cont">
                    { gradeOrder.map( ( grade, i ) => (
                        <div key={`edit-course-course-card-${i}`} className="edit-course-course-card">
                            <input 
                                key={`edit-course-course-card-grade-${i}`}
                                className="edit-course-course-card-name"
                                name={`gradeType${i}`}
                                value={ grade }
                                onChange={ ( e ) => handleGradeWeightChange( grade, e.target.value ) }
                            />
                            <input
                                key={ "edit-course-course-card-weight-" + i }
                                className="edit-course-course-card-final-grade"
                                type="number"
                                step="0.01"
                                name={`weight${i}`}
                                value={ courseGradeWeights[ grade ] }
                                onChange={ ( e ) => handleGradeWeightChange( grade, grade, Number( e.target.value ) ) }
                                onKeyDown={ ( e ) => {
                                    if ( e.key === "Enter" ) {
                                        e.preventDefault();
                                        reorderGrades();
                                    }
                                } }
                            />
                        </div>
                    ) ) }
                    <div className="edit-course-course-card" onClick={ () => handleNewGradeWeight() }>
                        <div className="edit-course-course-card-name">
                            { "Add Grade Type (ex. Text, Project)"  }
                        </div>
                        <div className="edit-course-course-card-final-grade">
                            { 0 }
                        </div>
                        <div className="edit-course-dark-card"></div>
                    </div>
                </div>
            </div>
            <div className="edit-course-submit-course" onClick={ () => submitForm() }>
                Submit Course
            </div>
            <div className="edit-course-delete-course" onClick={handleDeleteCourse}>
                Delete Course
            </div>
        </div>
    );
}

export default EditCourse; 