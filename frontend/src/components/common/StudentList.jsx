import StudentCard from "./studentCard.jsx";

const StudentList = ({ students, onDelete }) => {
  if (!students.length) {
    return (
      <div className="empty-state">
        <h3>No students yet</h3>
        <p>Add your first student to start tracking borrowers.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {students.map((student) => (
        <StudentCard
          key={student._id}
          student={student}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default StudentList;
