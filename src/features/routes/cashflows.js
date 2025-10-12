import express from "express";
import {
  getCashFlows,
  addCashFlow,
  updateCashFlow,
  deleteCashFlow,
  getStatsDaily,
  getStatsMonthly,
} from "../controllers/cashflowController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getCashFlows);
router.post("/", requireAuth, addCashFlow);
router.put("/:id", requireAuth, updateCashFlow);
router.delete("/:id", requireAuth, deleteCashFlow);

// 🆕 Tambahan route untuk statistik
router.get("/stats/daily", requireAuth, getStatsDaily);
router.get("/stats/monthly", requireAuth, getStatsMonthly);

export default router;
