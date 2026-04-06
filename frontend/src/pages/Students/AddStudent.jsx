import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStudent } from "../../api/students.js";
import StudentForm from "../../components/common/StudentForm.jsx";

const AddStudent = () => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (payload) => {
    setBusy(true);
    setError("");
    try {
      await createStudent(payload);
      navigate("/students");
    } catch (err) {
      setError(err.message || "Failed to create student.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Add Student</h2>
          <p>Create a student profile for borrowing books.</p>
        </div>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <StudentForm
        onSubmit={handleSubmit}
        submitLabel="Create Student"
        busy={busy}
      />
    </section>
  );
};

export default AddStudent;
