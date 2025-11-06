import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // adjust path if needed
import TaskCard from "./TaskCard";
import EditTask from "./EditTask/EditTask";
import EditCourse from "./EditCourse/EditCourse";
import "./TaskPage.css";

function TaskPage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]); // All of the courses available for a user
  const [ selectedCourseTab, setSelectedCourseTab ] = useState( "All Courses" ); // Current course tab selected, one of "All Courses" or availableCourses[i].courseName 
  const [selectedTask, setSelectedTask] = useState(null);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]); // All the tasks for the selected course per selectedCourseTab
  const [ checkedMap, setCheckedMap ] = useState( {} ); // key = task index, value = boolean
  const [ selectedGrade, setSelectedGrade ] = useState( 0.00 );
  const [ selectedTimeSpent, setTimeSpent ] = useState( "0 h 0 m" );
  const { accessToken } = useAuth(); // Get access token from context
  const [email, setEmail] = useState("catlover@gmail.com");
  const [courses, setCourses] = useState(["All Courses"]);
  const filters = ["Name", "Course", "% of Grade", "Time Spent", "Due Date"];

    const [ tasks, setTasks ] = useState( [] );
    const [ checkedMap, setCheckedMap ] = useState( {} ); // key = task index, value = boolean
    const [ selectedCourse, setSelectedCourse ] = useState( "All Courses" );
    const [ selectedGrade, setSelectedGrade ] = useState( 0.00 );
    const [ selectedTimeSpent, setTimeSpent ] = useState( "0 h 0 m" );

    const [ showEditTask, setShowEditTask ] = useState( false );
    const [ showEditCourse, setShowEditCourse ] = useState( false );

    useEffect( () => {
        document.body.style.overflow = showEditTask || showEditCourse ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [ showEditTask, showEditCourse ] );

    useEffect(() => {
        fetchCourses();
            // if (data.courses) {
            //   const names = data.courses.map((course: Course) => course.courseName);
            //   setCourses(["All Courses", ...names]);
            // }});
    });

    useEffect( () => {
        const initialMap = {};
        availableTasks.forEach( ( _, i ) => {
            initialMap[ i ] = false;
        } );
        setCheckedMap( initialMap );
    }, [ availableTasks ] );

    useEffect( () => {
        if ( selectedCourseTab === "All Courses" ) {
            fetchTasks();
        } else {
            fetch( "/courses_with_tasks.json" )
                .then( res => res.json() )
                .then( data => {
                    const course = data.courses.find( c => c.name === selectedCourseTab );
                    setAvailableTasks( course.tasks );
                    setSelectedGrade( course.currentGrade );

                    let totalMinutes = 0;
                    course.tasks.forEach( task => {
                        const match = task.timeSpent.completed.match( /(\d+)h\s*(\d+)?m?/ );
                        const hours = parseInt( match[ 1 ] ) || 0;
                        const minutes = parseInt( match[ 2 ] ) || 0;
                        totalMinutes += hours * 60 + minutes;
                    } );
                    const totalHours = Math.floor( totalMinutes / 60 );
                    const remainingMinutes = totalMinutes % 60;
                    const totalTimeString = `${totalHours}hr ${remainingMinutes}min`;
                    setTimeSpent( totalTimeString );
                } );
        }
      });

  // Toggle task checked state
  const toggleChecked = (index) => {
    setCheckedMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

    return (
        <div className="task-page">
            <div className="task-page-profile-cont">
                <img src="/images/profile.png" alt={ email + "'s profile picture" }  className="task-page-profile-pic"/>
                { selectedCourseTab === "All Courses" ? (
                    <div className="task-page-profile-name">
                        { email }
                    </div>
                ) : (
                    <div className="task-page-course-info">
                        <div className="task-page-course-name">
                            { selectedCourseTab }
                        </div>
                        <div className="task-page-course-details-cont">
                            <div className="task-page-course-detail">
                                <div>
                                    Number of Tasks
                                </div>
                                <div className="color-blue">
                                    { availableTasks.length }
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
                                    { selectedTimeSpent }
                                </div>
                            </div>
                        </div>
                    </div>
                ) }
            </div>
            <div className="task-page-edit-cont">
                <div className="task-page-edit-button" onClick={ () => setShowEditTask( !showEditTask ) }>
                    Edit Tasks
                </div>
                <div className="task-page-edit-button" onClick={ () => setShowEditCourse( !showEditCourse ) }>
                    Edit Courses
                </div>
            </div>
            <div className="task-page-course-cont">
                { availableCourses.map( ( course, i ) => ( 
                    <div 
                        key={ "task-page-" + course + "-" + i} 
                        className={ `task-page-course ${ selectedCourseTab === course ? "selected" : "" }` }
                        onClick={ () => setSelectedCourseTab( course ) }
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
                    { availableTasks.map( ( task, i ) => (
                        <TaskCard 
                            key={ "task-card-" + i }
                            name={ task.taskName }
                            course={ selectedCourseTab === "All Courses" ? task.courseName : selectedCourseTab }
                            grade={ task.grade }
                            dueDate={ task.dueDate }
                            timeSpent={ task.timeSpent.completed + " / " + task.timeSpent.estimated }
                            checked={ checkedMap[ i ] }
                            onClick={ () => toggleChecked( i ) }
                        />
                    ) ) }
                </div>
            </div>
            { showEditTask &&  (
                <div className="opacity" onClick={ () => setShowEditTask( !showEditTask ) }>
                    <EditTask />
                </div>
            ) }
            { showEditCourse &&  (
                <div className="opacity" onClick={ () => setShowEditCourse( !showEditCourse ) }>
                    <EditCourse />
                </div>
            ) }
        </div>
        <div className="task-page-task-flex-cont">
          {availableTasks.map((task, i) => (
            <TaskCard
              key={"task-card-" + i}
              name={task.taskName}
              course={
                selectedCourseTab === "All Courses"
                  ? task.courseName
                  : selectedCourseTab
              }
              grade={task.grade}
              dueDate={task.dueDate}
              timeSpent={
                task.timeSpent.completed + " / " + task.timeSpent.estimated
              }
              checked={checkedMap[i]}
              onClick={() => toggleChecked(i)}
            />
          ))}
        </div>
  );
}

export default TaskPage;

export default TaskPage;
