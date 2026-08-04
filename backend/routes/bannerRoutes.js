import express from "express";
import { getBannersAndOffers } from "../controllers/bannerController.js";

const router = express.Router();

router.get("/", getBannersAndOffers);

export default router;
