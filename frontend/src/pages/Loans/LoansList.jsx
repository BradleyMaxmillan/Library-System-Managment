import { useEffect, useMemo, useState } from "react";
import { getLoans, returnLoan } from "../../api/loans.js";

const LoansList = () => {
  const [loans, setLoans] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLoans = async (signal) => {
    setLoading(true);
    setError("");
    try {
      const data = await getLoans({ signal });
      setLoans(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to load loans.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadLoans(controller.signal);
    return () => controller.abort();
  }, []);

  const handleReturn = async (id) => {
    try {
      const updated = await returnLoan(id);
      setLoans((prev) =>
        prev.map((loan) => (loan._id === id ? updated : loan))
      );
    } catch (err) {
      setError(err.message || "Failed to return book.");
    }
  };

  const filteredLoans = useMemo(() => {
    if (filter === "all") return loans;
    return loans.filter((loan) => loan.status === filter);
  }, [loans, filter]);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Loans</h2>
          <p>Track borrowed books and return history.</p>
        </div>
      </div>
      <div className="toolbar">
        <div className="filter-group">
          <button
            className={`btn ${filter === "all" ? "primary" : "outline"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`btn ${filter === "borrowed" ? "primary" : "outline"}`}
            onClick={() => setFilter("borrowed")}
          >
            Borrowed
          </button>
          <button
            className={`btn ${filter === "returned" ? "primary" : "outline"}`}
            onClick={() => setFilter("returned")}
          >
            Returned
          </button>
        </div>
      </div>
      {loading ? <p className="muted">Loading loans...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {!loading && !filteredLoans.length ? (
        <div className="empty-state">
          <h3>No loans to display</h3>
          <p>Borrow a book to start tracking activity.</p>
        </div>
      ) : null}
      <div className="grid">
        {filteredLoans.map((loan) => (
          <article key={loan._id} className="card">
            <div className="card-header">
              <h3>{loan.book?.title || "Unknown book"}</h3>
              <span className={`status-pill ${loan.status}`}>
                {loan.status}
              </span>
            </div>
            <p className="card-meta">
              Student: {loan.student?.name || "Unknown"}
            </p>
            <p className="card-subtle">
              Borrowed:{" "}
              {loan.borrowedAt ? new Date(loan.borrowedAt).toLocaleString() : "—"}
            </p>
            <p className="card-subtle">
              Returned:{" "}
              {loan.returnedAt ? new Date(loan.returnedAt).toLocaleString() : "—"}
            </p>
            {loan.status === "borrowed" ? (
              <button className="btn outline" onClick={() => handleReturn(loan._id)}>
                Mark Returned
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default LoansList;
