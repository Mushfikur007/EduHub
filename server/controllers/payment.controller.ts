import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandeler from "../utils/ErrorHandler";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import { IOrder } from "../models/order.Model";
import { newOrder } from "../services/order.service";

// Get Stripe publishable key
export const getStripePublishableKey = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Stripe publishable key requested");
        console.log("Environment variable:", process.env.STRIPE_PUBLISHABLE_KEY ? "Found" : "Not found");
        
        if (!process.env.STRIPE_PUBLISHABLE_KEY) {
            console.warn("STRIPE_PUBLISHABLE_KEY is not set in environment variables");
            return next(new ErrorHandeler("Stripe key is not configured", 500));
        }
        
        res.status(200).json({
            publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
            success: true,
        });
        console.log("Stripe publishable key sent successfully");
    } catch (error: any) {
        console.error("Error in getStripePublishableKey:", error);
        return next(new ErrorHandeler(error.message, 500));
    }
});

// Create payment intent
export const createPaymentIntent = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Create payment intent requested");
        const { amount } = req.body;

        if (!amount) {
            return next(new ErrorHandeler("Amount is required", 400));
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            console.warn("STRIPE_SECRET_KEY is not set in environment variables");
            return next(new ErrorHandeler("Stripe is not configured properly", 500));
        }

        try {
            // Use actual Stripe SDK if available
            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
            
            console.log("Creating payment intent with Stripe SDK");
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'usd',
                automatic_payment_methods: { enabled: true },
            });
            
            console.log("Payment intent created successfully:", paymentIntent.id);
            res.status(200).json({
                client_secret: paymentIntent.client_secret,
                success: true,
            });
        } catch (stripeError: any) {
            console.error("Stripe error:", stripeError);
            
            // Fallback to mock payment intent if Stripe SDK fails
            console.log("Falling back to mock payment intent");
            const randomId = Math.random().toString(36).substring(2, 10);
            const randomSecret = Math.random().toString(36).substring(2, 10);
            const client_secret = `pi_${randomId}_secret_${randomSecret}`;
            
            res.status(200).json({
                client_secret,
                success: true,
                isMock: true,
            });
        }
    } catch (error: any) {
        console.error("Error in createPaymentIntent:", error);
        return next(new ErrorHandeler(error.message, 500));
    }
});

// Process payment
export const processPayment = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return next(new ErrorHandeler("Course ID is required", 400));
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandeler("Course not found", 404));
        }

        // Mock payment processing - in a real app, this would integrate with a payment gateway
        const paymentInfo = {
            id: "mock_payment_" + Math.floor(Math.random() * 1000000),
            status: "succeeded",
            type: "credit_card",
            amount: course.price
        };

        const data: any = {
            courseId: course._id,
            userId: req.user?._id,
            payment_info: paymentInfo,
        };

        // Create order after payment
        newOrder(data, res, next);

    } catch (error: any) {
        return next(new ErrorHandeler(error.message, 500));
    }
});

// Get payment status
export const getPaymentStatus = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { paymentId } = req.params;

        if (!paymentId) {
            return next(new ErrorHandeler("Payment ID is required", 400));
        }

        // Mock payment status check - in a real app, this would check with a payment gateway
        res.status(200).json({
            success: true,
            status: "succeeded",
            message: "Payment processed successfully"
        });

    } catch (error: any) {
        return next(new ErrorHandeler(error.message, 500));
    }
}); 