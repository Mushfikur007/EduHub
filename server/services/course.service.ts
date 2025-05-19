import { Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/catchAsyncError";

// create course
export const createCourse = CatchAsyncError(async (data: any, res: Response) => {
    try {
        console.log("Creating course with data:", data);
        
        // Ensure required fields are present
        if (!data.name) {
            return res.status(400).json({
                success: false,
                message: "Course name is required"
            });
        }
        
        const course = await CourseModel.create(data);
        console.log("Course created successfully:", course._id);
        
        res.status(201).json({
            success: true,
            course,
        });
    } catch (error: any) {
        console.error("Error in createCourse service:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create course"
        });
    }
});

// get all courses
export const getAllCoursesService = async (res: Response) => {
    const courses = await CourseModel.find().sort({
      createdAt: -1,
    });
  
    res.status(201).json({
      success: true,
      courses,
    });
  };
  