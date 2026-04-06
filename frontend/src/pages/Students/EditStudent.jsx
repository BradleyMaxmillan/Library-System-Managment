import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudent, updateStudent } from "../../api/students.js";
import StudentForm from "../../components/common/StudentForm.jsx";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [busy, setBusy] = useState(false);
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

  const handleSubmit = async (payload) => {
    setBusy(true);
    setError("");
    try {
      await updateStudent(id, payload);
      navigate(`/students/${id}`);
    } catch (err) {
      setError(err.message || "Failed to update student.");
    } finally {
      setBusy(false);
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
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Edit Student</h2>
          <p>Update student details and contact information.</p>
        </div>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <StudentForm
        initialValues={student}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        busy={busy}
      />
    </section>
  );
};

export default EditStudent;
