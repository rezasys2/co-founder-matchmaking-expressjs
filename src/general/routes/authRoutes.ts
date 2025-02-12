import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  changePassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forget", forgotPassword);
router.post("/reset-password/:token", changePassword);

export default router;
