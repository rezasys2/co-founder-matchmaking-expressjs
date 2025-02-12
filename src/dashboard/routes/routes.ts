import express from "express";
import userRoutes from "./userRoutes.js";
import matchRoutes from "./matchRoutes.js";
import chatRoutes from "./chatRoutes.js";
import settingRoutes from "./settingRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/matches", matchRoutes);
router.use("/chats", chatRoutes);
router.use("/settings", settingRoutes);

export default router;
