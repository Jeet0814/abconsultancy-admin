import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";

import authRoutes from "./modules/auth/auth.routes";
import publicRoutes from "./modules/public/public.routes";
import inquiriesRoutes from "./modules/inquiries/inquiries.routes";
import mastersRoutes from "./modules/masters/masters.routes";
import settingsRoutes from "./modules/settings/settings.routes";
import usersRoutes from "./modules/users/users.routes";
import auditRoutes from "./modules/audit/audit.routes";
import mediaRoutes from "./modules/media/media.routes";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const app = express();

// Security Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Managed per frontend
  }),
);

// CORS allow-list
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:5173,http://localhost:5174,https://abconsultancy.vercel.app")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Automatically allow localhost and 127.0.0.1 on any port in development
      if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS origin ${origin} not allowed.`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET || "ab_cookie_secret_key"));

// Static files for uploaded images
const UPLOAD_DIR = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(UPLOAD_DIR));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "A B Taxway Consultancy REST API",
  });
});

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin/inquiries", inquiriesRoutes);
app.use("/api/admin/masters", mastersRoutes);
app.use("/api/admin/settings", settingsRoutes);
app.use("/api/admin/users", usersRoutes);
app.use("/api/admin/audit", auditRoutes);
app.use("/api/admin/media", mediaRoutes);

// Centralized Error Handling
app.use(errorHandler);
