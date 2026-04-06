import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteStudent, getStudents } from "../../api/students.js";
import StudentList from "../../components/common/StudentList.jsx";

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudents = async (signal) => {
    setLoading(true);
    setError("");
    try {
      const data = await getStudents({ signal });
      setStudents(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to load students.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadStudents(controller.signal);
    return () => controller.abort();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((student) => student._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete student.");
    }
  };

  const filteredStudents = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return students;
    return students.filter((student) =>
      [student.name, student.email, student.studentId]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [students, query]);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Students</h2>
          <p>Track borrowers and manage student records.</p>
        </div>
        <Link className="btn primary" to="/students/new">
          Add Student
        </Link>
      </div>
      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Search by name, email, or ID..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {loading ? <p className="muted">Loading students...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {!loading ? (
        <StudentList students={filteredStudents} onDelete={handleDelete} />
      ) : null}
    </section>
  );
};

export default StudentsList;
