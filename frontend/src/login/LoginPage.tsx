import "../style.css";
import { LoginButton } from "../login/LoginButton"; // import the login button component

export function LoginPage() {
  return (
    <div className="login-page">
      <h2>Login Page</h2>
      <h3>Welcome to Mnemonic!</h3>
      <p>
        Mnemonic is a student-focused application, intending to help students succeed.
      </p>
      <div className="google-login-wrapper">
        <LoginButton /> {/* Render the button */}
      </div>
    </div>
  );
}
