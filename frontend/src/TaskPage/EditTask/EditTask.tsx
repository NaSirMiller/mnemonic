import { useState, useEffect } from "react";
import "./EditTask.css";

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

// type Course = {
//     name: string;
//     currentGrade: number;
//     gradeTypes: Record<string, number>;
//     tasks: Task[];
// };

function EditTask() {
    const sectionList = [ "Selct Task", "Task Name", "Task Grade", "Task Grade Weighting", "Time Spent", "Due Date" ];
    
    // form data
    const [ taskName, setTaskName ] = useState<string>( "" );
    const [ taskGradeWeight, setTaskGradeWeight ] = useState<string>( "" );
    const [ dueDate, setDueDate ] = useState<string>( "" );
    const [ timeSpent, setTimeSpent ] = useState<string>( "" );
    const [ taskGrade, setTaskGrade ] = useState<string>( "" );

    const [ courses, setCourses ] = useState<string []>( [ "" ] ); // list of courses
    const [ tasks, setTasks ] = useState<Task []>( [] ); // list of tasks
    const [ gradeWeights, setGradeWeights ] = useState<string []>( [ "" ] ); // list of grade weights
    const [ selectedCourse, setSelectedCourse ] = useState<string>( "" );
    const [ selectedTask, setSelectedTask ] = useState<Task | null>(null);
    const [ selectedGradeWeight, setSelectedGradeWeight ] = useState<string>( "" );

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
    
        console.log( tasks );
    }, [ ] );

    useEffect( () => {
        fetch( "/courses_with_tasks.json" )
            .then( res => res.json() )
            .then( data => {
                const course = data.courses.find( c => c.name === selectedCourse );
                setTasks( course.tasks );
                setSelectedTask( course.tasks[ 0 ] );
            } );
        fetch( "/courses.json" )
            .then( res => res.json() )
            .then( data => {
                const course = data.courses.find( c => c.name === selectedCourse );
                setGradeWeights( Object.keys( course.gradeTypes ) );
            } );
    }, [ selectedCourse ] );

    useEffect( () => {
        if ( selectedTask ) {
            setTaskName( selectedTask.taskName );
            setTaskGradeWeight( selectedTask.gradeType );
            if ( selectedTask.dueDate )
                setDueDate( new Date( selectedTask.dueDate ).toISOString().slice( 0, 16 ) );
            else
                setDueDate( "" );
            setTimeSpent( selectedTask.timeSpent ? selectedTask.timeSpent.completed + " / " + selectedTask.timeSpent.estimated : "" );
            if ( selectedTask.grade )
                setTaskGrade( selectedTask.grade.toString() );
            else
                setTaskGrade( "" );

            setSelectedGradeWeight( selectedTask.gradeType );
        }
    }, [ selectedTask ] );

    const handleNewTask = () => {
        const newTask : Task = {
            "courseName": selectedCourse,
            "taskName": "",
            "timeSpent": null,
            "dueDate": "",
            "grade": null,
            "gradeType": ""
        }
        setTasks( [...tasks, newTask] );
        setSelectedTask( newTask );
    }

    const changeTask = async () => {
        let newTimeSpent = null;
        if ( timeSpent ) {
            newTimeSpent = {
                completed: selectedTask.timeSpent.completed, 
                estimated: selectedTask.timeSpent.estimated
            };
        }

        // Create updated task
        const updatedTask: Task = {
            ...selectedTask,
            taskName,
            gradeType: taskGradeWeight,
            grade: taskGrade ? Number(taskGrade) : null,
            dueDate,
            timeSpent: newTimeSpent,
        };

        // Update tasks array
        const updatedTasks = tasks.map( t =>
            t === selectedTask ? updatedTask : t
        );

        setTasks( updatedTasks );
        setSelectedTask( updatedTask );

        // chatgpt wrote this
        // await fetch("/update-task", {
        //     method: "PUT",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //         courseName: selectedCourse,
        //         task: updatedTask,
        //     }),
        // });
    }

    return (
        <div className="edit-task" onClick={ (e) => e.stopPropagation() }>
            <div className="edit-task-title">
                Edit Tasks
            </div>

            <div className="edit-task-course-cont">
                { courses.map( ( course, i ) => ( 
                    <div 
                        key={ "edit-task-" + course + "-" + i} 
                        className={ `edit-task-course ${ selectedCourse === course ? "selected" : "" }` }
                        onClick={ () => setSelectedCourse( course ) }
                    >
                        { course }
                    </div>
                ) ) }
            </div>

            <div className="edit-task-section-title">
                Select Task*
            </div>
            <div className="edit-task-select-cont">
                <div className="edit-task-select-label-cont">
                    <div className="edit-task-select-label-name">
                        Name
                    </div>
                    <div className="edit-task-select-label-grade">
                        Grade
                    </div>
                    <div className="edit-task-select-label-time-spent">
                        Time Spent
                    </div>
                    <div className="edit-task-select-label-due-date">
                        Date
                    </div>
                </div>
                <div className="edit-task-task-card-cont">
                    { tasks.map( ( task, i ) => (
                        <div 
                            key={ "edit-task-task-card-" + i }
                            className={ `edit-task-task-card ${ selectedTask === task ? "selected" : "" }` }
                            onClick={ () => setSelectedTask( task ) }
                        >
                            <div className="edit-task-task-card-name">
                                { task.taskName }
                            </div>
                            <div className="edit-task-task-card-grade">
                                { task.grade }
                            </div>
                            <div className="edit-task-task-card-time-spent">
                                { task.timeSpent ? task.timeSpent.completed + " / " + task.timeSpent.estimated : "" }
                            </div>
                            <div className="edit-task-task-card-due-date">
                                { task.dueDate !== "" ? new Date( task.dueDate ).toLocaleString( "en-US", { month: "short", day: "numeric" } ) : "" }
                            </div>
                        </div>
                    ) ) }
                </div>
            </div>
            {/* <div className="edit-task-button-cont"> */}
            <div className="edit-task-add-task" onClick={ () => handleNewTask() }>
                Add Task
            </div>
            <div className="edit-task-section-title">
                Task Name*
            </div>
            <input 
                name="taskName" 
                className="edit-task-text-input"
                value={ taskName }
                onChange={ ( e ) => setTaskName( e.target.value ) }
                onBlur={ () => changeTask() }
            />
            <div className="edit-task-section-title">
                Task Grade Weight*
            </div>
            <div className="edit-task-grade-weight-cont">
                { gradeWeights.map( ( gradeWeight, i ) => ( 
                    <div 
                        key={ "edit-task-" + gradeWeight + "-" + i} 
                        className={ `edit-task-grade-weight ${ selectedGradeWeight === gradeWeight ? "selected" : "" }` }
                        onClick={ () => { 
                            setSelectedGradeWeight( gradeWeight );
                            setTaskGradeWeight( gradeWeight );
                            changeTask();
                        } }
                    >
                        { gradeWeight }
                    </div>
                ) ) }
            </div>
            <div className="edit-task-section-title">
                Due Date*
            </div>
            <input
                type="datetime-local"
                name="dueDate"
                className="edit-task-text-input"
                value={ dueDate }
                onChange={ ( e ) => { setDueDate( e.target.value ); changeTask(); } }
            />
            
            <div className="edit-task-section-title">
                Time Spent
            </div>
            <input 
                type="time"
                name="timeSpent"
                className="edit-task-text-input"
                value={ timeSpent }
                onChange={ ( e ) => setTimeSpent( e.target.value ) }
                onBlur={ () => changeTask() }
            />
            <div className="edit-task-section-title">
                Task Grade
            </div>
            <div className="edit-task-input-cont">
                <input 
                    type="number"
                    step="0.01"
                    name="taskGrade"
                    className="edit-task-text-input"
                    value={ taskGrade }
                    onChange={ ( e ) => setTaskGrade( e.target.value ) }
                    onBlur={ () => changeTask() }
                />
                <div className="edit-task-right-icon">
                    %
                </div>
            </div>
            <div className="edit-task-delete-task">
                Delete Task
            </div>
        </div>
    );
}

export default EditTask; 