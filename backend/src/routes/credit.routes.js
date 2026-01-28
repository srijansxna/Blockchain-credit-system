import express from "express";
import { applyForCredit } from "../controllers/credit.controller.js";

const router = express.Router();

router.post("/apply", applyForCredit);

export default router;
