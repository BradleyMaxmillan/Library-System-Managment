import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBook, updateBook } from "../../api/books.js";
import BookForm from "../../components/common/BookForm.jsx";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleSubmit = async (payload) => {
    setBusy(true);
    setError("");
    try {
      await updateBook(id, payload);
      navigate(`/books/${id}`);
    } catch (err) {
      setError(err.message || "Failed to update book.");
    } finally {
      setBusy(false);
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
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Edit Book</h2>
          <p>Adjust details or update availability status.</p>
        </div>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <BookForm
        initialValues={book}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        busy={busy}
      />
    </section>
  );
};

export default EditBook;
