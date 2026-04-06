import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="empty-state">
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link className="btn outline" to="/">
        Back to Dashboard
      </Link>
    </section>
  );
};

export default NotFound;
