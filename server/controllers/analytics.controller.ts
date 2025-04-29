import { Request, Response, NextFunction } from "express";
import ErrorHandeler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { generateLast12MonthData } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.Model";


// get user analytics---admin only
export const getUserAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await generateLast12MonthData(userModel);

            res.status(200).json({
                success: true,
               user, 
            });
            
        } catch (error: any) {
            return next(new ErrorHandeler(error.message, 400));
        }
        
    }
);

// get courses analytics
export const getCoursesAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courses = await generateLast12MonthData(CourseModel);

            res.status(200).json({
                success: true,
               courses, 
            });
            
        } catch (error: any) {
            return next(new ErrorHandeler(error.message, 400));
        }
        
    }
);

// get order analytics
export const getOrderAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orders = await generateLast12MonthData(OrderModel);

            res.status(200).json({
                success: true,
               orders, 
            });
            
        } catch (error: any) {
            return next(new ErrorHandeler(error.message, 400));
        }
        
    }
);