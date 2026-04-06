import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import useTheme from "../../hooks/useTheme.js";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, setMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="nav-shell">
      <div className="nav-brand">
        <span className="logo">L</span>
        <div>
          <p className="brand-title">Library System</p>
          <p className="brand-subtitle">Catalog Control Center</p>
        </div>
      </div>
      <nav className="nav-links">
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/books/new">Add Book</NavLink>
        <NavLink to="/students">Students</NavLink>
        <NavLink to="/loans">Loans</NavLink>
      </nav>
      <div className="nav-actions">
        <label className="theme-select-wrap">
          <span className="theme-select-label">Theme</span>
          <select
            className="theme-select"
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            aria-label="Theme mode"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        {user ? (
          <>
            <span className="nav-user">{user.name}</span>
            <button className="btn outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink className="btn outline" to="/login">
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Navbar;
