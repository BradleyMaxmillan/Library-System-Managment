import mongoose from "mongoose";

const studentSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
