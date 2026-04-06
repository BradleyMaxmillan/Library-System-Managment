import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBook } from "../../api/books.js";
import BookForm from "../../components/common/BookForm.jsx";

const AddBook = () => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (payload) => {
    setBusy(true);
    setError("");
    try {
      await createBook(payload);
      navigate("/books");
    } catch (err) {
      setError(err.message || "Failed to create book.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Add a New Book</h2>
          <p>Capture the essentials and keep the catalog tidy.</p>
        </div>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <BookForm
        onSubmit={handleSubmit}
        submitLabel="Create Book"
        busy={busy}
        showStatus={false}
      />
    </section>
  );
};

export default AddBook;
