import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarButton from "./NavBarButton.tsx";
import "./NavBar.css";

function NavBar() {
    const [ menuOpen, setMenuOpen ] = useState( false ); // controls mobile nav bar
    const [ clickedButton, setClickedButton ] = useState<string>( "Home" ); // controls focused tab
    const buttonTexts = [ "Home", "Tasks" ]; // array of buttons

    const navigate = useNavigate();

    const handleClick = ( text: string ) => {
        setClickedButton( text );
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
                        focused={ clickedButton === text }
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