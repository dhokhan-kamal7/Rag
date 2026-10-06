import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(
        email,
        password
      );

      if (user?.is_admin === true) {
        navigate("/admin");
      } else {
        navigate("/chat");
      }

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Invalid email or password."
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

          <h2>Welcome back</h2>

          <p className="auth-description">
            Sign in to continue to your knowledge assistant.
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
                placeholder="Enter your password"
                required
              />
            </label>


            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}


            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>

          </form>


          <p className="auth-switch">
            Don't have an account?

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
            >
              Create an account
            </button>
          </p>

        </div>

      </div>

    </main>
  );
}


export default Login;