import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandeler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.Model";
import CourseModel from "../models/course.model";
import userModel from "../models/user.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";
import { getAllOrderService, newOrder } from "../services/order.service";
import mongoose from "mongoose";

// create order
export const createOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, payment_info } = req.body as IOrder;
        
        console.log("Create order request received for courseId:", courseId);

        if (!courseId) {
            return next(new ErrorHandeler("Course ID is required", 400));
        }

        const user = await userModel.findById(req.user?._id);
        
        if (!user) {
            return next(new ErrorHandeler("User not found", 404));
        }

        // Check if course already purchased
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return next(new ErrorHandeler("Invalid course ID", 400));
        }

        const courseObjectId = new mongoose.Types.ObjectId(courseId);

        const courseExistInUser = user.courses.some((course: any) => 
            course.courseId && course.courseId.toString() === courseObjectId.toString()
        );

        if (courseExistInUser) {
            return next(new ErrorHandeler("You have already purchased this course", 400));
        }

        const course = await CourseModel.findById(courseObjectId);

        if (!course) {
            return next(new ErrorHandeler("Course not found", 404));
        }

        const data: any = {
            courseId: course._id,
            userId: user._id,
            payment_info,
        };

        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            }
        };

        const html = await ejs.renderFile(path.join(__dirname, '../mails/orderConfermation.mail.ejs'), { order: mailData });

        try {
            await sendMail({
                email: user.email,
                subject: "Order Confirmation",
                template: "orderConfermation.mail.ejs",
                data: mailData,
            });
        } catch (error: any) {
            console.log("Error sending email:", error);
            // Continue even if email fails
        }

        // Add course to user's courses
        console.log("Adding course to user's courses:", {
            userId: user._id,
            courseId: courseId
        });
        
        user.courses.push({ courseId: courseId });
        await user.save();

        console.log("User courses after purchase:", user.courses);

        await NotificationModel.create({
            user: user._id,
            title: "New Order",
            message: `You have a new order from ${course.name}`,
        });

        course.purchased = (course.purchased || 0) + 1;
        await course.save();

        newOrder(data, res, next);

    } catch (error: any) {
        console.error("Error creating order:", error);
        return next(new ErrorHandeler(error.message, 500));
    }
});

// get all orders --only for admin
export const getAllOrders = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        getAllOrderService(res);
      } catch (error: any) {
        return next(new ErrorHandeler(error.message, 400));
      }
    }
  );

// direct purchase course without payment
export const purchaseCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.body;
        
        console.log("Purchase course request received for courseId:", courseId);
        
        // Check if user is authenticated
        if (!req.user) {
            return next(new ErrorHandeler("Please login to purchase this course", 401));
        }

        if (!courseId) {
            return next(new ErrorHandeler("Course ID is required", 400));
        }

        const user = await userModel.findById(req.user?._id);
        
        if (!user) {
            return next(new ErrorHandeler("User not found", 404));
        }

        // Check if course already purchased
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return next(new ErrorHandeler("Invalid course ID", 400));
        }

        const courseObjectId = new mongoose.Types.ObjectId(courseId);

        // Check if course already purchased
        const courseExistInUser = user.courses.some((course: any) => 
            course.courseId && course.courseId.toString() === courseObjectId.toString()
        );

        if (courseExistInUser) {
            return next(new ErrorHandeler("You have already purchased this course", 400));
        }

        const course = await CourseModel.findById(courseObjectId);

        if (!course) {
            return next(new ErrorHandeler("Course not found", 404));
        }

        // Add course to user's courses
        console.log("Adding course to user's courses:", {
            userId: user._id,
            courseId: courseId
        });
        
        user.courses.push({ courseId: courseId });
        await user.save();

        console.log("User courses after purchase:", user.courses);

        // Send email confirmation
        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            }
        };

        try {
            await sendMail({
                email: user.email,
                subject: "Course Purchase Confirmation",
                template: "orderConfermation.mail.ejs",
                data: mailData,
            });
        } catch (error: any) {
            console.log("Error sending email:", error);
            // Continue even if email fails
        }

        // Create notification
        await NotificationModel.create({
            user: user._id,
            title: "Course Purchased",
            message: `You have successfully purchased ${course.name}`,
        });

        // Update course purchase count
        course.purchased = (course.purchased || 0) + 1;
        await course.save();

        // Create order record
        const data: any = {
            courseId: course._id,
            userId: user._id,
            payment_info: { 
                type: "direct-purchase",
                status: "succeeded" 
            },
        };

        const order = await OrderModel.create(data);

        res.status(201).json({
            success: true,
            order,
            message: "Course purchased successfully"
        });

    } catch (error: any) {
        console.error("Error purchasing course:", error);
        return next(new ErrorHandeler(error.message, 500));
    }
});