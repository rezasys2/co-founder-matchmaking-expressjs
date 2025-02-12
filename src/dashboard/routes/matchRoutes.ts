import express from "express";
import { getMatch, updateMatch } from "../controllers/matchController.js";

const router = express.Router();

router.get("/", getMatch);
router.put("/:id", updateMatch);

export default router;
