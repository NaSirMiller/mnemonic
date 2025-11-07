import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarButton from "./NavBarButton.tsx";
import "./NavBar.css";

function NavBar() {
    const [ menuOpen, setMenuOpen ] = useState( false ); // controls mobile nav bar
    const buttonTexts = [ "Home", "Tasks" ]; // array of buttons

    const navigate = useNavigate();

    const focusedButton = ( () => {
        switch (location.pathname) {
            case "/":
                return "Home";
            case "/tasks":
                return "Tasks";
            default:
                return "";
        }
    } ) ();

    const handleClick = ( text: string ) => {
        if ( text === "Home" )
            navigate( "/" );
        if ( text === "Tasks" )
            navigate( "/tasks" );
    };

    return (
        <div className="navbar-cont">
            <img 
                src={ "/images/logo-removebg.png" }  
                alt="mnemonic logo" 
                className="navbar-logo"
                onClick={ () => handleClick( "Home" ) }
            />

            {/* Hamburger button for small screens */}
            <div 
                className="navbar-hamburger"
                onClick={ () => setMenuOpen( !menuOpen ) }
            >
                ☰
            </div>

            {/* Buttons container */}
            <div className={ `navbar-buttons-cont ${ menuOpen ? "open" : "" }` }>
                {buttonTexts.map( ( text, i ) => (
                    <NavBarButton
                        key={ text + i }
                        text={ text }
                        focused={ focusedButton === text }
                        onClick={ () => handleClick( text ) }
                    />
                ))}

                
            </div>
            {/* <div className="navbar-sign-in">
                Sign In
            </div> */}
            <div className="navbar-sign-in">
                Log Out
            </div>
        </div>
    );
}

export default NavBar;