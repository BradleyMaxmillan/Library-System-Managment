import mongoose from "mongoose";

const loanSchema = mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed",
    },
    borrowedAt: { type: Date, default: Date.now },
    returnedAt: { type: Date },
  },
  { timestamps: true }
);

const Loan = mongoose.model("Loan", loanSchema);
export default Loan;
