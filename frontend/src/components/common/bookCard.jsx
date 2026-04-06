import { Link } from "react-router-dom";

const BookCard = ({ book, onDelete }) => {
  return (
    <article className="card">
      <div className="card-header">
        <h3>{book.title}</h3>
        <span className={`status-pill ${book.status}`}>
          {book.status}
        </span>
      </div>
      <p className="card-meta">by {book.author}</p>
      <p className="card-subtle">ISBN: {book.isbn}</p>
      <div className="card-actions">
        <Link className="btn ghost" to={`/books/${book._id}`}>
          Details
        </Link>
        <Link className="btn outline" to={`/books/${book._id}/edit`}>
          Edit
        </Link>
        <button className="btn danger" onClick={() => onDelete(book._id)}>
          Delete
        </button>
      </div>
    </article>
  );
};

export default BookCard;
