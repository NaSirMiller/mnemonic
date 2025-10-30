import "./NavBar.css";

interface NavBarButtonProps {
    text: string;
    focused: boolean;
    onClick: () => void;
}

function NavBarButton( { text, focused, onClick }: NavBarButtonProps ) {
    return (
        <div
            className={ `navbar-button-cont ${ focused ? "focused" : "" }` }
            onClick={ onClick }
        >
            { text }

            {/* Render inverse curve caps only when focused */}
            { focused && (
                <>
                <div className="left"></div>
                <div className="right"></div>
                </>
            )}
        </div>
    );
}

export default NavBarButton;