import { Link } from "react-router-dom";

const StudentCard = ({ student, onDelete }) => {
  return (
    <article className="card">
      <div className="card-header">
        <h3>{student.name}</h3>
      </div>
      <p className="card-meta">{student.email}</p>
      <p className="card-subtle">ID: {student.studentId}</p>
      <p className="card-subtle">Dept: {student.department}</p>
      <p className="card-subtle">Phone: {student.phone}</p>
      <div className="card-actions">
        <Link className="btn ghost" to={`/students/${student._id}`}>
          Details
        </Link>
        <Link className="btn outline" to={`/students/${student._id}/edit`}>
          Edit
        </Link>
        <button className="btn danger" onClick={() => onDelete(student._id)}>
          Delete
        </button>
      </div>
    </article>
  );
};

export default StudentCard;
