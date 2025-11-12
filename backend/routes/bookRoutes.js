import express from "express";
import {getBookById,getBooks,deleteBook,updateBook,createBook} from "../controllers/bookController.js";

const router = express.Router();


router.get("/",getBooks);
router.post("/",createBook);
router.get("/:id",getBookById);
router.put("/:id",updateBook);
router.delete("/:id",deleteBook);

export default router;