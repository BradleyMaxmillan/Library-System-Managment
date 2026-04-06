import BookCard from "./bookCard.jsx";

const BookList = ({ books, onDelete }) => {
  if (!books.length) {
    return (
      <div className="empty-state">
        <h3>No books yet</h3>
        <p>Add your first title to start building the catalog.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {books.map((book) => (
        <BookCard key={book._id} book={book} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default BookList;
