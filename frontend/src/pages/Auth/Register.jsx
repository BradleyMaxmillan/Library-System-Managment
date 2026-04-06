import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      await register(values);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to register.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page auth-page">
      <div className="page-header">
        <div>
          <h2>Create account</h2>
          <p>Get set up in minutes and start managing titles.</p>
        </div>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            disabled={busy}
            required
          />
        </div>
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
            {busy ? "Creating..." : "Register"}
          </button>
        </div>
        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
