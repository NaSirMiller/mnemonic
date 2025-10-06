import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

export function LoginPage() {
  const responseMessage = (response: CredentialResponse) => {
    console.log(response);
  };
  const errorMessage = () => {
    console.log("Login failed.");
  };
  return (
    <div>
      <h2>Login Page</h2>
      <h3>Welcome to Mnemonic!</h3>
      <p>
        Mnemonic is a student focused application, intending on helping students
        succeed.
      </p>
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  );
}
