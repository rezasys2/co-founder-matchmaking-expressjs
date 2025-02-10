import express from "express";
import userRoutes from "./userRoutes";
import matchRoutes from "./matchRoutes";
import chatRoutes from "./chatRoutes";
import settingRoutes from "./settingRoutes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/matches", matchRoutes);
router.use("/chats", chatRoutes);
router.use("/settings", settingRoutes);

export default router;
