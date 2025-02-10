import express from "express";
import { getSetting, updateSetting } from "../controllers/settingController";

const router = express.Router();

router.get("/", getSetting);
router.put("/", updateSetting);

export default router;
