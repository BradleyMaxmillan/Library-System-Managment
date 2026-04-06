import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(values);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to login.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page auth-page">
      <div className="page-header">
        <div>
          <h2>Welcome back</h2>
          <p>Sign in to manage your library system.</p>
        </div>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            disabled={busy}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            disabled={busy}
            required
          />
        </div>
        <div className="form-actions">
          <button className="btn primary" type="submit" disabled={busy}>
            {busy ? "Signing in..." : "Login"}
          </button>
        </div>
        <p className="muted">
          No account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
