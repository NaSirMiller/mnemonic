import { useEffect, useState } from "react";
import "./HomePage.css";
import NavBar from "../components/NavBar/NavBar";

function HomePage() {
    const tasks = [
        { name: "Homework 1", date: "Nov 1"},
        { name: "Homework 2", date: "Nov 2"},
        { name: "Homework 3", date: "Nov 3"},
        { name: "Homework 4", date: "Nov 4"},
        { name: "Homework 5", date: "Nov 5"},
        { name: "Homework 6", date: "Nov 6"},
        { name: "Homework 7", date: "Nov 7"},
        { name: "Homework 8", date: "Nov 8"},
        { name: "Homework 9", date: "Nov 9"},
        { name: "Homework 10", date: "Nov 10"},
        { name: "Homework 11", date: "Nov 11"},
        { name: "Homework 12", date: "Nov 12"},
        { name: "Homework 13", date: "Nov 13"},
        { name: "Homework 14", date: "Nov 14"},
        { name: "Homework 15", date: "Nov 15"},
        { name: "Homework 16", date: "Nov 16"},
        { name: "Homework 17", date: "Nov 17"},
        { name: "Homework 18", date: "Nov 18"},
        { name: "Homework 19", date: "Nov 19"},
        { name: "Homework 20", date: "Nov 19"},
        { name: "Homework 21", date: "Nov 19"},
        { name: "Homework 22", date: "Nov 19"},
        { name: "Homework 23", date: "Nov 19"},
        { name: "Homework 24", date: "Nov 19"},
        { name: "Homework 25", date: "Nov 19"},
        { name: "Homework Menmonic Data Structures 99999999", date: "Nov 11"}
    ];
    
    const [ days, setDays ] = useState( [] );
    const [ month, setMonth ] = useState( new Date().getMonth() );
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    useEffect( () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const startDay = firstDayOfMonth.getDay();
        const startDate = new Date(year, month, 1 - startDay);

        const tempDays = [];
        for (let i = 0; i < 35; i++) {
            const day = new Date( startDate );
            day.setDate( startDate.getDate() + i );
            tempDays.push( day );
        }
        setDays( tempDays );
    }, [ month ] );

    const abrvMonth = ( month ) => {
        return months[ month ].slice( 0, 3 );
    };

    return (
        <div className="home-page">
            
            <div className="home-page-left">
                <div className="home-page-title">
                    Tasks
                </div>
                <div className="home-page-task-type-cont">
                    <div className="home-page-task-type">
                        Name
                    </div>
                    <div className="home-page-task-type">
                        Date
                    </div>
                </div>
                <div className="home-page-task-cont">
                    { tasks.map( ( task, i ) => (
                        <div key={ "home-page-task-" + i } className="home-page-task">
                            <div className="home-page-task-name">
                                { task.name } 
                            </div>
                            <div className="home-page-task-date">
                                { task.date.length === 5 ? task.date + '\u00A0' : task.date }
                            </div>
                        </div>
                    ) ) }
                </div>
            </div>
            <div className="home-page-right">
                <div className="home-page-title">
                    { months[ month ] }
                </div>
                <div className="home-page-week-cont">
                    <div className="home-page-week">
                        SUN
                    </div>
                    <div className="home-page-week">
                        MON
                    </div>
                    <div className="home-page-week">
                        TUE
                    </div>
                    <div className="home-page-week">
                        WED
                    </div>
                    <div className="home-page-week">
                        THU
                    </div>
                    <div className="home-page-week">
                        FRI
                    </div>
                    <div className="home-page-week">
                        SAT
                    </div>
                </div>
                <div className="home-page-calendar-cont">
                    { days.map( ( day, i ) => (
                        <div key={ "calendar-card-" + i } className="home-page-calendar-card">
                            { day.getDate() == 1 ? abrvMonth( day.getMonth() ) + " " + day.getDate() : day.getDate() }
                        </div>
                    ) ) }
                </div>
            </div>
        </div>
    );
}

export default HomePage; 