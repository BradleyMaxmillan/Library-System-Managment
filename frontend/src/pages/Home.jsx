import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getLoanAnalytics } from "../api/loans.js";

const Home = () => {
  const [analytics, setAnalytics] = useState({
    summary: {
      totalBooks: 0,
      availableBooks: 0,
      borrowedBooks: 0,
      totalStudents: 0,
      totalLoans: 0,
      activeLoans: 0,
      returnedLoans: 0,
      returnRate: 0,
    },
    topBorrowedBooks: [],
    topBorrowers: [],
    studentsByDepartment: [],
    recentActivity: [],
    monthlyTrend: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadAnalytics = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getLoanAnalytics({ signal: controller.signal });
        setAnalytics(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load dashboard analytics.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
    return () => controller.abort();
  }, []);

  const summaryCards = useMemo(() => {
    const summary = analytics.summary || {};
    return [
      {
        label: "Total Books",
        value: summary.totalBooks ?? 0,
      },
      {
        label: "Borrowed Now",
        value: summary.borrowedBooks ?? 0,
      },
      {
        label: "Returned Loans",
        value: summary.returnedLoans ?? 0,
      },
      {
        label: "Return Rate",
        value: `${summary.returnRate ?? 0}%`,
      },
      {
        label: "Active Loans",
        value: summary.activeLoans ?? 0,
      },
      {
        label: "Students",
        value: summary.totalStudents ?? 0,
      },
    ];
  }, [analytics.summary]);

  const topBorrowedBooks = analytics.topBorrowedBooks || [];
  const topBorrowers = analytics.topBorrowers || [];
  const studentsByDepartment = analytics.studentsByDepartment || [];
  const recentActivity = analytics.recentActivity || [];
  const monthlyTrend = useMemo(
    () => analytics.monthlyTrend || [],
    [analytics.monthlyTrend]
  );
  const summary = analytics.summary || {};

  const loanBreakdown = useMemo(() => {
    const borrowed = summary.activeLoans ?? 0;
    const returned = summary.returnedLoans ?? 0;
    const total = borrowed + returned;
    const borrowedAngle = total ? (borrowed / total) * 360 : 0;
    return { borrowed, returned, total, borrowedAngle };
  }, [summary.activeLoans, summary.returnedLoans]);

  const trendMaxValue = useMemo(() => {
    const maxValue = monthlyTrend.reduce((max, month) => {
      return Math.max(max, month.borrowed || 0, month.returned || 0);
    }, 0);
    return maxValue || 1;
  }, [monthlyTrend]);

  const busiestMonth = useMemo(() => {
    if (!monthlyTrend.length) return "No trend data yet";
    const top = monthlyTrend.reduce((best, current) => {
      if (!best) return current;
      return current.borrowed > best.borrowed ? current : best;
    }, null);
    return top ? `${top.label} (${top.borrowed} borrowed)` : "No trend data yet";
  }, [monthlyTrend]);

  const formatDateTime = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString();
  };

  return (
    <section className="page home-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Library Management</p>
          <h2>Performance Dashboard</h2>
          <p className="muted">
            Live analysis of borrowed, returned, and current circulation.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="btn primary" to="/books">
            View Books
          </Link>
          <Link className="btn outline" to="/students">
            View Students
          </Link>
          <Link className="btn outline" to="/loans">
            View Loans
          </Link>
        </div>
      </div>

      {loading ? <p className="muted">Loading analytics...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading ? (
        <>
          <div className="summary-grid">
            {summaryCards.map((card) => (
              <article key={card.label} className="summary-card">
                <p className="summary-label">{card.label}</p>
                <p className="summary-value">{card.value}</p>
              </article>
            ))}
          </div>

          <div className="charts-grid">
            <article className="stat-card chart-card">
              <div className="trend-head">
                <h3 className="insight-title">Loan Status Breakdown</h3>
                <p className="muted">Current cumulative loan distribution</p>
              </div>
              {!loanBreakdown.total ? (
                <p className="muted">No loan records available yet.</p>
              ) : (
                <div className="donut-layout">
                  <div
                    className="donut-chart"
                    style={{
                      background: `conic-gradient(var(--chart-borrowed) 0deg ${loanBreakdown.borrowedAngle}deg, var(--chart-returned) ${loanBreakdown.borrowedAngle}deg 360deg)`,
                    }}
                    aria-label={`Loan distribution: ${loanBreakdown.borrowed} borrowed, ${loanBreakdown.returned} returned`}
                    role="img"
                  >
                    <div className="donut-hole">
                      <p className="donut-total">{loanBreakdown.total}</p>
                      <p className="donut-caption">Total loans</p>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-row">
                      <span className="legend-dot borrowed" />
                      <span>Borrowed: {loanBreakdown.borrowed}</span>
                    </div>
                    <div className="legend-row">
                      <span className="legend-dot returned" />
                      <span>Returned: {loanBreakdown.returned}</span>
                    </div>
                    <p className="muted">Return Rate: {summary.returnRate ?? 0}%</p>
                  </div>
                </div>
              )}
            </article>

            <article className="stat-card chart-card">
              <div className="trend-head">
                <h3 className="insight-title">6-Month Borrowing Trend</h3>
                <p className="muted">{busiestMonth}</p>
              </div>
              {!monthlyTrend.length ? (
                <p className="muted">No monthly trend available yet.</p>
              ) : (
                <>
                  <div className="bar-chart">
                    {monthlyTrend.map((month) => {
                      const borrowedRaw = month.borrowed || 0;
                      const returnedRaw = month.returned || 0;
                      const borrowedHeight = borrowedRaw
                        ? Math.max((borrowedRaw / trendMaxValue) * 100, 6)
                        : 0;
                      const returnedHeight = returnedRaw
                        ? Math.max((returnedRaw / trendMaxValue) * 100, 6)
                        : 0;

                      return (
                        <div key={month.label} className="bar-column">
                          <div className="bar-pair">
                            <span
                              className="bar borrowed"
                              style={{ height: `${borrowedHeight}%` }}
                              title={`${month.label} borrowed: ${borrowedRaw}`}
                            />
                            <span
                              className="bar returned"
                              style={{ height: `${returnedHeight}%` }}
                              title={`${month.label} returned: ${returnedRaw}`}
                            />
                          </div>
                          <p className="bar-label">{month.label.split(" ")[0]}</p>
                          <p className="bar-value">
                            {borrowedRaw}/{returnedRaw}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="chart-legend">
                    <div className="legend-row">
                      <span className="legend-dot borrowed" />
                      <span>Borrowed</span>
                    </div>
                    <div className="legend-row">
                      <span className="legend-dot returned" />
                      <span>Returned</span>
                    </div>
                  </div>
                </>
              )}
            </article>
          </div>

          <div className="home-insights">
            <article className="stat-card">
              <h3 className="insight-title">Top Borrowed Books</h3>
              {!topBorrowedBooks.length ? (
                <p className="muted">
                  No loan data yet. Borrow a few books to see ranking.
                </p>
              ) : (
                <div className="insight-list">
                  {topBorrowedBooks.map((item) => (
                    <div key={item.bookId} className="insight-item">
                      <div>
                        <p className="insight-name">{item.title}</p>
                        <p className="card-subtle">{item.author}</p>
                      </div>
                      <div className="insight-metrics">
                        <span>{item.borrowCount} borrows</span>
                        <span className={`status-pill ${item.status}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="stat-card">
              <h3 className="insight-title">Top Borrowers</h3>
              {!topBorrowers.length ? (
                <p className="muted">No borrowing history available yet.</p>
              ) : (
                <div className="insight-list">
                  {topBorrowers.map((item) => (
                    <div
                      key={`${item.studentDbId || item.studentId}-${item.borrowCount}`}
                      className="insight-item"
                    >
                      <div>
                        <p className="insight-name">{item.name}</p>
                        <p className="card-subtle">
                          {item.studentId ? `${item.studentId} • ` : ""}
                          {item.department}
                        </p>
                      </div>
                      <div className="insight-metrics">
                        <span>{item.borrowCount} borrows</span>
                        <span>{item.activeLoans} active</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="stat-card accent">
              <h3 className="insight-title">Recent Loan Activity</h3>
              {!recentActivity.length ? (
                <p className="muted">No activity available yet.</p>
              ) : (
                <div className="insight-list">
                  {recentActivity.map((item) => (
                    <div key={item._id} className="insight-item">
                      <div>
                        <p className="insight-name">{item.bookTitle}</p>
                        <p className="card-subtle">
                          {item.studentName}
                          {item.studentId ? ` (${item.studentId})` : ""}
                        </p>
                        <p className="card-subtle">
                          Borrowed: {formatDateTime(item.borrowedAt)}
                        </p>
                        <p className="card-subtle">
                          Returned: {formatDateTime(item.returnedAt)}
                        </p>
                      </div>
                      <span className={`status-pill ${item.status}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="stat-card">
              <h3 className="insight-title">Students by Department</h3>
              {!studentsByDepartment.length ? (
                <p className="muted">No student records available yet.</p>
              ) : (
                <div className="insight-list">
                  {studentsByDepartment.map((item) => (
                    <div key={item.department} className="insight-item">
                      <p className="insight-name">{item.department}</p>
                      <div className="insight-metrics">
                        <span>{item.count} students</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>

        </>
      ) : null}
      {!loading && !analytics.summary?.totalBooks ? (
        <div className="empty-state">
          <h3>No library data yet</h3>
          <p>
            Add books and students, then create loans to unlock borrowed and
            returned analytics.
          </p>
        </div>
      ) : null}
    </section>
  );
};

export default Home;
