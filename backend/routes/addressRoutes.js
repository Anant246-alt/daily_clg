import express from "express";
import { getAddresses, saveAddress, deleteAddress } from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAddresses);
router.post("/", saveAddress);
router.put("/", saveAddress);
router.delete("/:id", deleteAddress);

export default router;
