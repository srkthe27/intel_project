/*import React, { useState } from "react";

interface ForgotPasswordProps {
  onBackToSignIn: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToSignIn }) => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = () => {
    // API call for password reset
    console.log("Password reset for:", email);
  };

  return (
    <div className="container mt-5">
      <h2>Forgot Password</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-warning"
          onClick={handleForgotPassword}
        >
          Reset Password
        </button>
        <button
          type="button"
          className="btn btn-secondary mt-3"
          onClick={onBackToSignIn}
        >
          Back to Sign In
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;*/
// src/components/ForgotPassword.tsx
// src/components/ForgotPassword.tsx
import React from "react";

interface ForgotPasswordProps {
  onBackToSignIn: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToSignIn }) => {
  const handleResetPassword = () => {
    // Logic for resetting password
    alert("Password reset link sent!");
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center">Forgot Password</h5>
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Enter your email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    required
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={handleResetPassword}
                >
                  Reset Password
                </button>
                <div className="mt-3 text-center">
                  <a href="#" onClick={onBackToSignIn}>
                    Back to Sign In
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
