import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteStudent, getStudent } from "../../api/students.js";

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadStudent = async () => {
      setLoading(true);
      try {
        const data = await getStudent(id, { signal: controller.signal });
        setStudent(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load student.");
        }
      } finally {
        setLoading(false);
      }
    };
    loadStudent();
    return () => controller.abort();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await deleteStudent(id);
      navigate("/students");
    } catch (err) {
      setError(err.message || "Failed to delete student.");
    }
  };

  if (loading) {
    return (
      <section className="page">
        <p className="muted">Loading student...</p>
      </section>
    );
  }

  if (!student) {
    return (
      <section className="page">
        <p className="error">{error || "Student not found."}</p>
        <Link className="btn outline" to="/students">
          Back to Students
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>{student.name}</h2>
          <p className="muted">{student.email}</p>
        </div>
        <div className="header-actions">
          <Link className="btn outline" to={`/students/${id}/edit`}>
            Edit
          </Link>
          <button className="btn danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <div className="details-card">
        <div>
          <p className="detail-label">Student ID</p>
          <p className="detail-value">{student.studentId}</p>
        </div>
        <div>
          <p className="detail-label">Department</p>
          <p className="detail-value">{student.department}</p>
        </div>
        <div>
          <p className="detail-label">Phone</p>
          <p className="detail-value">{student.phone}</p>
        </div>
        <div>
          <p className="detail-label">Joined</p>
          <p className="detail-value">
            {student.createdAt
              ? new Date(student.createdAt).toLocaleString()
              : "—"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default StudentDetails;
