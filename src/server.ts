import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./dashboard/routes/adminRoutes.js";
import dashboardRoutes from "./dashboard/routes/routes.js";
import authRoutes from "./general/routes/authRoutes.js";
import generalRoutes from "./general/routes/routes.js";
import { connectDB } from "./config/db.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Dashboard not-protected
app.use("/api/v1/admin/", adminRoutes);
// Dashboard protected
app.use("/api/v1/dashboard/", protect, dashboardRoutes);

// General not-protected
app.use("/api/v1/auth", authRoutes);
// General protected
app.use("/api/v1/general/", protect, generalRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
