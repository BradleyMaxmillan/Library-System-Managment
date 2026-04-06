import { useMemo, useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  studentId: "",
  department: "",
  phone: "",
};

const normalize = (value) => value.trim();

const validate = (values) => {
  const errors = {};
  if (!normalize(values.name)) errors.name = "Name is required.";
  if (!normalize(values.email)) errors.email = "Email is required.";
  if (!normalize(values.studentId)) errors.studentId = "Student ID is required.";
  if (!normalize(values.department))
    errors.department = "Department is required.";
  if (!normalize(values.phone)) errors.phone = "Phone is required.";
  return errors;
};

const StudentForm = ({
  initialValues,
  onSubmit,
  submitLabel = "Save",
  busy = false,
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
    setTouched({
      name: true,
      email: true,
      studentId: true,
      department: true,
      phone: true,
    });
    if (hasErrors) return;
    const payload = {
      name: normalize(values.name),
      email: normalize(values.email),
      studentId: normalize(values.studentId),
      department: normalize(values.department),
      phone: normalize(values.phone),
    };
    onSubmit(payload);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={busy}
        />
        {touched.name && errors.name ? (
          <p className="field-error">{errors.name}</p>
        ) : null}
      </div>
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={busy}
        />
        {touched.email && errors.email ? (
          <p className="field-error">{errors.email}</p>
        ) : null}
      </div>
      <div className="form-row">
        <label htmlFor="studentId">Student ID</label>
        <input
          id="studentId"
          name="studentId"
          type="text"
          value={values.studentId}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={busy}
        />
        {touched.studentId && errors.studentId ? (
          <p className="field-error">{errors.studentId}</p>
        ) : null}
      </div>
      <div className="form-row">
        <label htmlFor="department">Department</label>
        <input
          id="department"
          name="department"
          type="text"
          value={values.department}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={busy}
        />
        {touched.department && errors.department ? (
          <p className="field-error">{errors.department}</p>
        ) : null}
      </div>
      <div className="form-row">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="text"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={busy}
        />
        {touched.phone && errors.phone ? (
          <p className="field-error">{errors.phone}</p>
        ) : null}
      </div>
      <div className="form-actions">
        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
