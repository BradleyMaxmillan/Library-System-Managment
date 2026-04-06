import { useMemo, useState } from "react";

const emptyForm = {
  title: "",
  author: "",
  isbn: "",
  status: "available",
};

const normalize = (value) => value.trim();

const validate = (values) => {
  const errors = {};
  if (!normalize(values.title)) errors.title = "Title is required.";
  if (!normalize(values.author)) errors.author = "Author is required.";
  if (!normalize(values.isbn)) errors.isbn = "ISBN is required.";
  return errors;
};

const BookForm = ({
  initialValues,
  onSubmit,
  submitLabel = "Save",
  busy = false,
  showStatus = true,
}) => {
  const [values, setValues] = useState({ ...emptyForm, ...initialValues });
  const [touched, setTouched] = useState({});

  const errors = useMemo(() => validate(values), [values]);
  const hasErrors = Object.keys(errors).length > 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ title: true, author: true, isbn: true, status: true });
    if (hasErrors) return;
    const payload = {
      title: normalize(values.title),
      author: normalize(values.author),
      isbn: normalize(values.isbn),
      status: values.status,
    };
    onSubmit(payload);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="The Pragmatic Programmer"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={busy}
        />
        {touched.title && errors.title ? (
          <p className="field-error">{errors.title}</p>
        ) : null}
      </div>
      <div className="form-row">
        <label htmlFor="author">Author</label>
        <input
          id="author"
          name="author"
          type="text"
          placeholder="Andrew Hunt, David Thomas"
          value={values.author}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={busy}
        />
        {touched.author && errors.author ? (
          <p className="field-error">{errors.author}</p>
        ) : null}
      </div>
      <div className="form-row">
        <label htmlFor="isbn">ISBN</label>
        <input
          id="isbn"
          name="isbn"
          type="text"
          placeholder="978-0201616224"
          value={values.isbn}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={busy}
        />
        {touched.isbn && errors.isbn ? (
          <p className="field-error">{errors.isbn}</p>
        ) : null}
      </div>
      {showStatus ? (
        <div className="form-row">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={values.status}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={busy}
          >
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
          </select>
        </div>
      ) : null}
      <div className="form-actions">
        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
