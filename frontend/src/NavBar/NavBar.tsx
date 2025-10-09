import { useState } from "react";
import NavBarButton from "./NavBarButton.tsx";
import "./NavBar.css";

function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false); // controls mobile nav bar
    const [clickedButton, setClickedButton] = useState<string>("Home"); // controls focused tab
    const buttonTexts = ["Home", "Courses", "Tasks", "Sign Up", "Log In"]; // array of buttons

    const handleClick = ( text: string ) => {
        setClickedButton(text);
    };

    return (
        <div className="navbar-cont">
            <div className="navbar-logo">Mnemonic Logo</div>

            {/* Hamburger button for small screens */}
            <div 
                className="navbar-hamburger"
                onClick={ () => setMenuOpen(!menuOpen) }
            >
                ☰
            </div>

            {/* Buttons container */}
            <div className={`navbar-buttons-cont ${menuOpen ? "open" : ""}`}>
                {buttonTexts.map( ( text, i ) => (
                    <NavBarButton
                        key={ text + i }
                        text={ text }
                        focused={ clickedButton === text }
                        onClick={ () => handleClick(text) }
                    />
                ))}
            </div>
        </div>
    );
}

export default NavBar;
