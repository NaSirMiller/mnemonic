import { useState, useEffect } from "react";
import "./EditCourse.css";

type Task = {
    courseName: string;
    taskName: string;
    timeSpent: {
        completed: string;
        estimated: string;
    } | null;
    dueDate: string;
    grade: number | null;
    gradeType: string;
};

type Course = {
    name: string;
    currentGrade: number;
    gradeTypes: Record<string, number>;
    tasks: Task[];
};

function EditCourse() {    
    // form data
    const [ courseName, setCourseName ] = useState<string>( "" );
    const [ courseGrade, setCourseGrade ] = useState<string>( "" );
    const [ courseGradeWeights, setCourseGradeWeights ] = useState<Record<string, number>>( { } );

    const [ courses, setCourses ] = useState<string []>( [ "" ] ); // list of course names
    const [ selectedCourse, setSelectedCourse ] = useState<string>( "" );

    const [gradeOrder, setGradeOrder] = useState<string[]>([]);

    useEffect( () => {
        fetch( "/courses.json" )
            .then( res => res.json() )
            .then( data => {
                if ( data.courses ) {
                    const names = data.courses.map( course => course.name );
                    setCourses( [ ...names ] );
                    setSelectedCourse( names[ 0 ] );
                }
        } );
    }, [ ] );

    useEffect( () => {
        fetch( "/courses.json" )
            .then( res => res.json() )
            .then( data => {
                const course = data.courses.find( ( c: { name: string } ) => c.name === selectedCourse );

                if ( course ) {
                    setCourseName( course.name );
                    setCourseGrade( course.currentGrade.toString() );
                    setCourseGradeWeights( course.gradeTypes );

                    const grades = Object.keys( course.gradeTypes );
                    grades.sort( ( a, b ) => {
                        const wA = course.gradeTypes[ a ];
                        const wB = course.gradeTypes[ b ];
                        if (wA !== wB)
                            return wB - wA;
                        return a.localeCompare( b );
                    } );
                    setGradeOrder( grades );
                }
            } );
    }, [ selectedCourse ] );

    const handleNewCourse = () => {
        const newCourse: Course = {
            name: " ",
            currentGrade: 0,
            gradeTypes: {},
            tasks: [],
        };
        console.log(newCourse)
        setCourses( prev => [ ...prev, newCourse.name ] );
        setSelectedCourse( newCourse.name );
        // insert backend to add newCourse to json

    };

    const handleNewGradeWeight = () => {
        setCourseGradeWeights(prev => ({
            ...prev,
            "" : 0
        } ) );

        setGradeOrder( prev => [...prev, "" ] );
        reorderGrades();
        // insert backend to add grade weight to json
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

    const changeCourse = async () => {
        // back end code goes here
    }

    return (
        <div className="edit-course" onClick={ (e) => e.stopPropagation() }>
            <div className="edit-course-title">
                Edit Courses
            </div>

            <div className="edit-course-course-cont">
                { courses.map( ( course, i ) => ( 
                    <div 
                        key={ "edit-course-" + course + "-" + i} 
                        className={ `edit-course-course ${ selectedCourse === course ? "selected" : "" }` }
                        onClick={ () => setSelectedCourse( course ) }
                    >
                        { course }
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
                onBlur={ () => changeCourse() }
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
                    onBlur={ () => changeCourse() }
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
                        <div key={ "edit-course-course-card-" + i } className="edit-course-course-card">
                            <input 
                                key={ "edit-course-course-card-grade-" + i } 
                                className="edit-course-course-card-name"
                                name={ "gradeType" + i}
                                value={ grade }
                                onChange={ ( e ) => handleGradeWeightChange( grade, e.target.value ) }
                                onBlur={ () => changeCourse() }
                            />
                            <input
                                key={ "edit-course-course-card-weight-" + i }
                                className="edit-course-course-card-final-grade"type="number"
                                step="0.01"
                                name={ "weight" + i }
                                value={ courseGradeWeights[ grade ] }
                                onChange={ ( e ) => handleGradeWeightChange( grade, grade, Number( e.target.value ) ) }
                                onKeyDown={ ( e ) => {
                                    if ( e.key === "Enter" ) {
                                        e.preventDefault();
                                        reorderGrades();
                                        changeCourse();
                                    }
                                } }
                                onBlur={ () => { reorderGrades(); changeCourse()} }
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

            <div className="edit-course-delete-course">
                Delete Course
            </div>
        </div>
    );
}

export default EditCourse; 