require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import paymentRouter from "./routes/payment.route";
import path from "path";
import fs from "fs";

// Check environment variables
console.log("Checking environment variables...");
const requiredEnvVars = [
  "STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY"
];

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    const value = process.env[varName];
    const maskedValue = value?.substring(0, 8) + "..." + value?.substring(value.length - 4);
    console.log(`✅ ${varName} is set: ${maskedValue}`);
  } else {
    console.warn(`⚠️ ${varName} is not set`);
  }
});

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8000', process.env.ORIGIN || '*'],
  credentials: true,
}));

// routes
app.use("/api/v1", userRouter, courseRouter, orderRouter, notificationRouter, analyticsRouter, layoutRouter);
app.use("/api/v1/payment", paymentRouter);

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Api is working",
  });
});

// Serve static files from uploads directory
const uploadsPath = path.join(__dirname, 'uploads');
console.log('Serving static files from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// unknown route
app.all("/*path", (req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error(
    `Can't find ${req.originalUrl} on this server!`
  ) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
