import { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import "./TaskPage.css";


function TaskPage() {
    const [ email, setEmail ] = useState( "catlover@gmail.com" );
    const [ courses, setCourses ] = useState( [ "All Courses" ] );
    const filters = [ "Name", "Course", "% of Grade", "Time Spent", "Due Date" ];

    const [ tasks, setTasks ] = useState( [] );
    const [ checkedMap, setCheckedMap ] = useState( {} ); // key = task index, value = boolean
    const [ selectedCourse, setSelectedCourse ] = useState( "All Courses" );
    const [ selectedGrade, setSelectedGrade ] = useState( 0.00 );

    useEffect( () => {
        fetch("/courses.json")
            .then( res => res.json() )
            .then( data => {
                if ( data.courses ) {
                    const names = data.courses.map( course => course.name );
                    setCourses( [ "All Courses", ...names ] );
                }
      })

        // console.log( tasks );
    }, [] );

    useEffect( () => {
        const initialMap = {};
        tasks.forEach( ( _, i ) => {
            initialMap[ i ] = false;
        } );
        setCheckedMap( initialMap );
    }, [ tasks ] );

    useEffect( () => {
        if (selectedCourse === "All Courses") {
            fetch( "/tasks.json" )
                .then( ( res ) => res.json() )
                .then( ( data ) => setTasks( data.tasks ) );
        } else {
            fetch( "/courses_with_tasks.json" )
                .then( res => res.json() )
                .then( data => {
                    const course = data.courses.find( c => c.name === selectedCourse );
                    setTasks( course.tasks );
                    setSelectedGrade( course.currentGrade );
                } );
        }
    }, [ selectedCourse ]);

    const toggleChecked = ( index ) => {
        setCheckedMap( prev => ( {
            ...prev,
            [ index ]: !prev[ index ],
        } ) );
        // console.log( checkedMap[ index ] );
    };

    return (
        <div className="task-page">
            <div className="task-page-profile-cont">
                <img src="/images/profile.png" alt={ email + "'s profile picture" }  className="task-page-profile-pic"/>
                { selectedCourse === "All Courses" ? (
                    <div className="task-page-profile-name">
                        { email }
                    </div>
                ) : (
                    <div className="task-page-course-info">
                        <div className="task-page-course-name">
                            { selectedCourse }
                        </div>
                        <div className="task-page-course-details-cont">
                            <div className="task-page-course-detail">
                                <div>
                                    Number of Tasks
                                </div>
                                <div className="color-blue">
                                    { tasks.length }
                                </div>
                            </div>
                            <div className="task-page-course-detail">
                                <div>
                                    Current Grade
                                </div>
                                <div className="color-blue">
                                    { selectedGrade }
                                </div>
                            </div>
                            <div className="task-page-course-detail">
                                <div>
                                    Total Time Spent
                                </div>
                                <div className="color-blue">
                                    0 hr 0 min
                                </div>
                            </div>
                        </div>
                    </div>
                ) }
            </div>
            <div className="task-page-edit-cont">
                <div className="task-page-edit-button">
                    Edit Tasks
                </div>
                <div className="task-page-edit-button">
                    Edit Courses
                </div>
            </div>
            <div className="task-page-course-cont">
                { courses.map( ( course, i ) => ( 
                    <div 
                        key={ "task-page-" + course + "-" + i} 
                        className={ `task-page-course ${ selectedCourse === course ? "selected" : "" }` }
                        onClick={ () => setSelectedCourse( course ) }
                    >
                        { course }
                    </div>
                ) ) }
            </div>
            <div className="task-page-task-cont">
                <div className="task-page-task-label-cont">
                    <div className="task-page-task-label-checkbox"></div>
                    <div className="task-page-task-label-name">
                        Name
                    </div>
                    <div className="task-page-task-label-course">
                        Course
                    </div>
                    <div className="task-page-task-label-grade">
                        Grade
                    </div>
                    <div className="task-page-task-label-time-spent">
                        Time Spent
                    </div>
                    <div className="task-page-task-label-due-date">
                        Due Date
                    </div>
                </div>
                <div className="task-page-task-flex-cont">
                    { tasks.map( ( task, i ) => (
                        <TaskCard 
                            key={ "task-card-" + i }
                            name={ task.taskName }
                            course={ task.courseName }
                            grade={ task.grade }
                            dueDate={ task.dueDate }
                            timeSpent={ task.timeSpent.completed + " / " + task.timeSpent.estimated }
                            checked={ checkedMap[ i ] }
                            onClick={ () => toggleChecked( i ) }
                        />
                    ) ) }
                </div>
            </div>
        </div>
    );
}

export default TaskPage; 