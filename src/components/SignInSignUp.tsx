import React, { useState } from "react";
import axios from "axios";
import "./SignInSignUp.css";

interface SignInSignUpProps {
  onAuthenticate: () => void;
  onForgotPassword: () => void;
}

const SignInSignUp: React.FC<SignInSignUpProps> = ({
  onAuthenticate,
  onForgotPassword,
}) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [age, setAge] = useState<number | string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async () => {
    if (Number(age) > 18) {
      alert("Only users under 18 can create an account.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/sign-up/", {
        name,
        email,
        age,
        password,
        confirmPassword,
      });
      if (response.data.message) {
        onAuthenticate(); // Handle successful authentication
      }
    } catch (err: any) {
      if (err.response) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage("An error occurred during sign-up.");
      }
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/sign-in/", {
        email,
        password,
      });
      if (response.data.message) {
        onAuthenticate(); // Handle successful sign-in
      }
    } catch (err: any) {
      if (err.response) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage("An error occurred during sign-in.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center">
                {showSignUp ? "Sign Up" : "Sign In"}
              </h5>
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <form>
                {showSignUp ? (
                  <>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="confirm-password"
                        className="form-label"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="age" className="form-label">
                        Age
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={handleSignUp}
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={handleSignIn}
                    >
                      Sign In
                    </button>
                  </>
                )}
              </form>
              <div className="mt-3 text-center">
                <a href="#" onClick={() => setShowSignUp(!showSignUp)}>
                  {showSignUp
                    ? "Already have an account? Sign In"
                    : "Don’t have an account? Sign Up"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;
