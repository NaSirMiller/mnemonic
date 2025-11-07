import { useState, useEffect } from "react";
import courseData from "../../../mock_data/courses.json";
import courseTaskData from "../../../mock_data/courses_with_tasks.json"
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

function EditTask() {    
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
        // fetch( "/courses.json" )
        //     .then( res => res.json() )
        //     .then( data => {
        //         if ( data.courses ) {
        //             const names = data.courses.map( course => course.name );
        //             setCourses( [ ...names ] );
        //             setSelectedCourse( names[ 0 ] );
        //         }
        // } );
        if (courseData.courses) {
            const names = courseData.courses.map(course => course.name);
            setCourses([...names]);
            setSelectedCourse(names[0]);
        }
    }, [ ] );

    useEffect( () => {
        // fetch( "/courses_with_tasks.json" )
        //     .then( res => res.json() )
        //     .then( data => {
        //         const course = data.courses.find( c => c.name === selectedCourse );
        //         setTasks( course.tasks );
        //         setSelectedTask( course.tasks[ 0 ] );
        //     } );
        // fetch( "/courses.json" )
        //     .then( res => res.json() )
        //     .then( data => {
        //         const course = data.courses.find( c => c.name === selectedCourse );
        //         setGradeWeights( Object.keys( course.gradeTypes ) );
        //     } );

        if (courseTaskData.courses) {
            const course = courseTaskData.courses.find( c => c.name === selectedCourse );
            if (course) {
                setTasks( course.tasks );
                setSelectedTask( course.tasks[ 0 ] );
            }
        }
        if (courseData.courses) {
            const course = courseData.courses.find( c => c.name === selectedCourse );
            if (course)
                setGradeWeights( Object.keys( course.gradeTypes ) );
        }
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

    const changeTask = () => {
        let newTimeSpent = null;
        if ( timeSpent ) {
            const [completedStr, estimatedStr] = timeSpent.split(" / ");
            newTimeSpent = {
                completed: completedStr.trim(), 
                estimated: estimatedStr.trim()
            };
        }

        console.log( taskGradeWeight )

        // Create updated task
        const updatedTask: Task = {
            ...selectedTask,
            taskName: taskName,
            courseName: selectedCourse,
            gradeType: taskGradeWeight,
            grade: taskGrade ? Number(taskGrade) : null,
            dueDate,
            timeSpent: newTimeSpent,
        };
        console.log( updatedTask );

        // Update tasks array
        const updatedTasks = tasks.map( t =>
            t === selectedTask ? updatedTask : t
        );

        setTasks( updatedTasks );
        setSelectedTask( updatedTask );
  
        //----------------//
        // back end stuff //
        //----------------//
        // back end that doesnt work because this should be in express
        // const filePath = path.resolve(__dirname, '../../../mock_data/courses_with_tasks.json');
        // alert( 1 )
        // const backendCourseData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        // alert( 2 )
        // const updatedCourses = backendCourseData.courses.map(course =>
        //     course.name === selectedCourse
        //         ? { ...course, tasks: updatedTasks }
        //         : course
        // );
        // alert( 3 )
        // fs.writeFileSync(filePath, JSON.stringify({ courses: updatedCourses }, null, 2));
        // alert( 4 )
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
                            <div className="edit-task-task-card-time-spent">gradeType
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
                            setTaskGradeWeight( gradeWeight );
                            setSelectedGradeWeight( gradeWeight );
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
                // type="time"
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