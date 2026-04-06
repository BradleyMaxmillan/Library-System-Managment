import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="muted">Loading session...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
