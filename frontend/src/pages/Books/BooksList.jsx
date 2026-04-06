import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBook, getBooks } from "../../api/books.js";
import BookList from "../../components/common/BookList.jsx";

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBooks = async (signal) => {
    setLoading(true);
    setError("");
    try {
      const data = await getBooks({ signal });
      setBooks(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to load books.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadBooks(controller.signal);
    return () => controller.abort();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((book) => book._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete book.");
    }
  };

  const filteredBooks = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return books;
    return books.filter((book) =>
      [book.title, book.author, book.isbn]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [books, query]);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Book Catalog</h2>
          <p>Manage availability and keep your inventory precise.</p>
        </div>
        <Link className="btn primary" to="/books/new">
          Add Book
        </Link>
      </div>
      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Search by title, author, ISBN..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {loading ? <p className="muted">Loading books...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {!loading ? (
        <BookList books={filteredBooks} onDelete={handleDelete} />
      ) : null}
    </section>
  );
};

export default BooksList;
