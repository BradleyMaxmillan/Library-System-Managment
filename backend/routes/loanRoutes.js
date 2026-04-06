import express from "express";
import {
  createLoan,
  getLoanAnalytics,
  getLoans,
  returnLoan,
} from "../controllers/loanController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getLoans);
router.get("/analytics/overview", protect, getLoanAnalytics);
router.post("/", protect, createLoan);
router.patch("/:id/return", protect, returnLoan);

export default router;
