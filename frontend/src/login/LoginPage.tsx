import { LoginButton } from "./LoginButton"; 
import "./SignIn.css";

export function LoginPage() {

    return (
        <div className="signin-page">
            <div className="signin-page-title">
                Welcome to Mnemonic!
            </div>
            <div className="signin-page-description">
                Our app connects to your Google Calendar and uses AI to prioritize your tasks and assignments. No more juggling deadlines: just open Mnemonic and see exactly what to tackle next.
            </div>
            <LoginButton />
        </div>
    );
}
