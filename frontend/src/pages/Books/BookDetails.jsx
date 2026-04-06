import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteBook, getBook } from "../../api/books.js";
import { getLoans, createLoan, returnLoan } from "../../api/loans.js";
import { getStudents } from "../../api/students.js";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [loans, setLoans] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loanBusy, setLoanBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const loadBook = async () => {
      setLoading(true);
      try {
        const data = await getBook(id, { signal: controller.signal });
        setBook(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load book.");
        }
      } finally {
        setLoading(false);
      }
    };
    loadBook();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    const loadSupporting = async () => {
      try {
        const [studentsData, loansData] = await Promise.all([
          getStudents({ signal: controller.signal }),
          getLoans({ signal: controller.signal }),
        ]);
        setStudents(studentsData);
        setLoans(loansData);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load supporting data.");
        }
      }
    };
    loadSupporting();
    return () => controller.abort();
  }, []);

  const activeLoan = useMemo(() => {
    return loans.find(
      (loan) => loan.book?._id === id && loan.status === "borrowed"
    );
  }, [loans, id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await deleteBook(id);
      navigate("/books");
    } catch (err) {
      setError(err.message || "Failed to delete book.");
    }
  };

  const handleBorrow = async () => {
    if (!selectedStudent) {
      setError("Select a student to borrow this book.");
      return;
    }
    setLoanBusy(true);
    setError("");
    try {
      const newLoan = await createLoan({
        bookId: id,
        studentId: selectedStudent,
      });
      setLoans((prev) => [newLoan, ...prev]);
      setBook((prev) => (prev ? { ...prev, status: "borrowed" } : prev));
      setSelectedStudent("");
    } catch (err) {
      setError(err.message || "Failed to borrow book.");
    } finally {
      setLoanBusy(false);
    }
  };

  const handleReturn = async () => {
    if (!activeLoan) return;
    setLoanBusy(true);
    setError("");
    try {
      const updated = await returnLoan(activeLoan._id);
      setLoans((prev) =>
        prev.map((loan) => (loan._id === updated._id ? updated : loan))
      );
      setBook((prev) => (prev ? { ...prev, status: "available" } : prev));
    } catch (err) {
      setError(err.message || "Failed to return book.");
    } finally {
      setLoanBusy(false);
    }
  };

  if (loading) {
    return (
      <section className="page">
        <p className="muted">Loading book...</p>
      </section>
    );
  }

  if (!book) {
    return (
      <section className="page">
        <p className="error">{error || "Book not found."}</p>
        <Link className="btn outline" to="/books">
          Back to Books
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>{book.title}</h2>
          <p className="muted">by {book.author}</p>
        </div>
        <div className="header-actions">
          <Link className="btn outline" to={`/books/${id}/edit`}>
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
          <p className="detail-label">ISBN</p>
          <p className="detail-value">{book.isbn}</p>
        </div>
        <div>
          <p className="detail-label">Status</p>
          <p className={`status-pill ${book.status}`}>{book.status}</p>
        </div>
        <div>
          <p className="detail-label">Added</p>
          <p className="detail-value">
            {book.createdAt ? new Date(book.createdAt).toLocaleString() : "—"}
          </p>
        </div>
        <div>
          <p className="detail-label">Last Updated</p>
          <p className="detail-value">
            {book.updatedAt ? new Date(book.updatedAt).toLocaleString() : "—"}
          </p>
        </div>
        <div>
          <p className="detail-label">Borrowing</p>
          {book.status === "available" ? (
            <div className="borrow-row">
              <select
                value={selectedStudent}
                onChange={(event) => setSelectedStudent(event.target.value)}
                disabled={loanBusy}
              >
                <option value="">Select student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.studentId})
                  </option>
                ))}
              </select>
              <button
                className="btn primary"
                onClick={handleBorrow}
                disabled={loanBusy}
              >
                {loanBusy ? "Borrowing..." : "Borrow"}
              </button>
            </div>
          ) : (
            <div className="borrow-row">
              <div>
                <p className="card-meta">
                  Borrowed by: {activeLoan?.student?.name || "Unknown"}
                </p>
                <p className="card-subtle">
                  Borrowed:{" "}
                  {activeLoan?.borrowedAt
                    ? new Date(activeLoan.borrowedAt).toLocaleString()
                    : "—"}
                </p>
              </div>
              <button
                className="btn outline"
                onClick={handleReturn}
                disabled={loanBusy}
              >
                {loanBusy ? "Returning..." : "Mark Returned"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookDetails;
