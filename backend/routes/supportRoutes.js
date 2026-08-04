import express from "express";
import { raiseTicket } from "../controllers/supportController.js";

const router = express.Router();

router.post("/ticket", raiseTicket);

export default router;
