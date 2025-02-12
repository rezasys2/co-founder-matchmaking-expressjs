import express from "express";
import { loginAdmin } from "../controllers/adminController.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Admin login
router.post("/login", loginAdmin);

// Register a new admin (optional)
// router.post("/register", async (req, res): Promise<void> => {
//   try {
//     const { username, password } = req.body;
//     const adminExists = await Admin.findOne({ username });
//     if (adminExists) {
//       res.status(400).json({ message: "Admin already exists" });
//       return;
//     }

//     const admin = new Admin({ username, password });
//     const savedAdmin = await admin.save();
//     res.status(201).json(savedAdmin);
//     return;
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//     return;
//   }
// });

export default router;
