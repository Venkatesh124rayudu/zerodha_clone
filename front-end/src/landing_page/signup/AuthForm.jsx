import React, { useState } from "react";
import { Link } from "react-router-dom";

import { apiPost, DASHBOARD_URL } from "../../config";

// Shared form for signup and login. On success the user is sent to the dashboard app,
// which reads the same httpOnly cookie.
function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = isSignup ? form : { email: form.email, password: form.password };
      await apiPost(isSignup ? "/auth/signup" : "/auth/login", body);
      window.location.href = DASHBOARD_URL;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-lg-6 d-none d-lg-block text-center">
          <img src="/media/images/signup.png" alt="" className="img-fluid" style={{ maxWidth: "80%" }} />
        </div>
        <div className="col-lg-4 col-md-7">
          <h1 className="fs-2 mb-2">{isSignup ? "Open a free demat account" : "Login to Kite"}</h1>
          <p className="text-muted mb-4">
            {isSignup ? "Start investing brokerage free." : "Welcome back. Log in to your dashboard."}
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {isSignup && (
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input id="username" name="username" className="form-control" value={form.username}
                  onChange={handleChange} autoComplete="username" required />
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" name="email" type="email" className="form-control" value={form.email}
                onChange={handleChange} autoComplete="email" required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" name="password" type="password" className="form-control" value={form.password}
                onChange={handleChange} autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={6} required />
              {isSignup && <div className="form-text">At least 6 characters.</div>}
            </div>

            {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

            <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
              {loading ? "Please wait..." : isSignup ? "Sign up" : "Login"}
            </button>
          </form>

          <p className="mt-3 text-muted">
            {isSignup ? "Already have an account? " : "New to Zerodha? "}
            <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Login" : "Sign up"}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
