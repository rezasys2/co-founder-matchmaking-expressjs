import express from "express";
import { getMatch, updateMatch } from "../controllers/matchController";

const router = express.Router();

router.get("/", getMatch);
router.put("/:id", updateMatch);

export default router;
