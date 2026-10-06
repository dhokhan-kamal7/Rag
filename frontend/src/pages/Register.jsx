import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(
        email,
        password
      );

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to create account."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-brand">
          <div className="auth-brand-icon">
            ✦
          </div>

          <h1>Knowledge AI</h1>

          <p>
            AI Knowledge Assistant
          </p>
        </div>


        <div className="auth-content">

          <h2>Create your account</h2>

          <p className="auth-description">
            Create an account to access the knowledge assistant.
          </p>


          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <label>
              Email

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                required
              />
            </label>


            <label>
              Password

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Create a password"
                required
              />
            </label>


            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}


            {success && (
              <div className="auth-success">
                {success}
              </div>
            )}


            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>


          <p className="auth-switch">
            Already have an account?

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Sign in
            </button>
          </p>

        </div>

      </div>

    </main>
  );
}


export default Register;