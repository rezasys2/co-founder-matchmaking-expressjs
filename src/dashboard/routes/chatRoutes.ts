import express from "express";
import { getChats, getChatMessages } from "../controllers/chatController";

const router = express.Router();

router.get("/", getChats);
router.get("/:id", getChatMessages);

export default router;
