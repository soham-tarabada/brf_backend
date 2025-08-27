import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import memberRoutes from "./routes/members.js";
import contactRoutes from "./routes/contact.js";
import serviceRoutes from './routes/service.js'
import Admin from "./models/Admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/contact", contactRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running successfully" });
});

// Seeder for default admin
async function seedDefaultAdmin() {
  const defaultUsername = "superadmin@yopmail.com";
  const defaultPassword = "Admin@123";
  const existingAdmin = await Admin.findOne({ username: defaultUsername });
  if (!existingAdmin) {
    const admin = new Admin({
      username: defaultUsername,
      password: defaultPassword,
    });
    await admin.save();
    console.log("Default admin created:", defaultUsername);
  } else {
    console.log("Default admin already exists:", defaultUsername);
  }
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedDefaultAdmin();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
