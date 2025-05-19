import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { createPaymentIntent, getPaymentStatus, getStripePublishableKey, processPayment } from "../controllers/payment.controller";

const paymentRouter = express.Router();

// Get Stripe publishable key
paymentRouter.get("/stripepublishablekey", getStripePublishableKey);

// Create payment intent
paymentRouter.post("/", isAuthenticated, createPaymentIntent);

// Process payment route
paymentRouter.post("/process", isAuthenticated, processPayment);

// Get payment status
paymentRouter.get("/status/:paymentId", isAuthenticated, getPaymentStatus);

export default paymentRouter; 