import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: {        // ✅ Must be lowercase 'isbn'
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["available", "borrowed"],
      default: "available",
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
