import express from "express";
import {
  getBookById,
  getBooks,
  deleteBook,
  updateBook,
  createBook,
} from "../controllers/bookController.js";
import protect from "../middleware/auth.js";

const router = express.Router();


router.get("/", protect, getBooks);
router.post("/", protect, createBook);
router.get("/:id", protect, getBookById);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

export default router;
