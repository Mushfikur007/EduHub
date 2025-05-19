import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandeler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import { title } from "process";
import NotificationModel from "../models/notification.Model";
import fs from "fs";

// upload course
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Upload course request received");
      
      // Get course data from the request body
      let data = req.body;
      
      // Handle JSON string if provided
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (error) {
          console.error("Error parsing JSON data:", error);
          return next(new ErrorHandeler("Invalid data format", 400));
        }
      }
      
      // Fix the typo in field name
      if (data.description && !data.discription) {
        data.discription = data.description;
      }
      
      // Handle thumbnail file from multer
      if (req.file) {
        const filename = req.file.filename;
        // Ensure URL is properly formatted without api/v1
        const serverUrl = (process.env.SERVER_URL || 'http://localhost:8000').replace(/\/api\/v1\/?$/, '');
        const fileUrl = `${serverUrl}/uploads/thumbnails/${filename}`;
        
        console.log("Thumbnail file uploaded:", fileUrl);
        
        data.thumbnail = {
          public_id: filename,
          url: fileUrl,
        };
      }
      // Handle base64 thumbnail data
      else if (data.thumbnail && typeof data.thumbnail === 'string' && data.thumbnail.startsWith('data:image')) {
        console.log("Base64 thumbnail received");
        
        // Generate a filename
        const filename = `thumbnail-${Date.now()}.jpg`;
        const filePath = path.join(__dirname, '../uploads/thumbnails', filename);
        
        // Create directory if it doesn't exist
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        try {
          // Extract base64 data
          const base64Data = data.thumbnail.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Save the file
          fs.writeFileSync(filePath, buffer);
          
          // Ensure URL is properly formatted without api/v1
          const serverUrl = (process.env.SERVER_URL || 'http://localhost:8000').replace(/\/api\/v1\/?$/, '');
          const fileUrl = `${serverUrl}/uploads/thumbnails/${filename}`;
          
          console.log("Thumbnail saved to:", filePath);
          console.log("Thumbnail URL:", fileUrl);
          
          data.thumbnail = {
            public_id: filename,
            url: fileUrl,
          };
        } catch (error) {
          console.error("Error saving base64 thumbnail:", error);
          // Continue without thumbnail if there's an error
        }
      }
      
      console.log("Creating course with data:", {
        ...data,
        thumbnail: data.thumbnail ? "thumbnail_present" : "missing"
      });
      
      createCourse(data, res, next);
    } catch (error: any) {
      console.error("Error in uploadCourse:", error);
      return next(new ErrorHandeler(error.message, 500));
    }
  }
);

// edit course
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const courseId = req.params.id;

      // Handle thumbnail file if new one is uploaded
      if (req.file) {
        const filename = req.file.filename;
        // Ensure URL is properly formatted without api/v1
        const serverUrl = (process.env.SERVER_URL || 'http://localhost:8000').replace(/\/api\/v1\/?$/, '');
        const fileUrl = `${serverUrl}/uploads/thumbnails/${filename}`;
        
        data.thumbnail = {
          public_id: filename,
          url: fileUrl,
        };
      }

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandeler(error.message, 500));
    }
  }
);

// get single course --- without purchasing
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course: JSON.parse(isCacheExist),
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links"
        );

        await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandeler(error.message, 500));
    }
  }
);

// get all courses without purchesed
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const isCacheExist = await redis.get("allCourses");
      // if (isCacheExist) {
      //   console.log("Fetching courses from cache");
      //   const courses = JSON.parse(isCacheExist);
      //   console.log("Courses fetched from cache", courses);
      //   res.status(200).json({
      //     success: true,
      //     courses: JSON.parse(isCacheExist),
      //   });
      // } else {
      //   console.log("Fetching courses from database");
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links"
        );
        console.log("Courses fetched from database", courses);

        await redis.set("allCourses", JSON.stringify(courses));

        res.status(200).json({
          success: true,
          courses,
        });
      // }
    } catch (error: any) {
      return next(new ErrorHandeler(error.message, 500));
    }
  }
);

// get course content --only for valid user
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      // Check if the course exists in the user's courses array
      const courseExists = userCourseList?.some(
        (course: any) => course.courseId === courseId
      );

      if (!courseExists) {
        return next(
          new ErrorHandeler("You have not purchased this course", 400)
        );
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandeler("Course not found", 404));
      }

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandeler(error.message, 500));
    }
  }
);

// add question in course
interface IAddQuestion {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestion = req.body;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandeler("Invalid course id", 400));
      }

      const courseContent = course?.courseData.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandeler("Invalid course content id", 400));
      }
      // create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // add the new question to the course content
      courseContent.questions.push(newQuestion);

      
      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question Recived",
        message: `You have a new question in ${courseContent?.title}`,
    });

      // save the updated course
      await course?.save();

      res.status(200).json({
        success: true,
        message: "Question added successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandeler(error.message, 500));
    }
  }
);

// ans question in course
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandeler("Invalid course id", 400));
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandeler("Invalid course content id", 400));
      }

      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandeler("Invalid question id", 400));
      }

      // create a new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      if (!question.questionReplies) {
        question.questionReplies = [];
      }

      question.questionReplies.push(newAnswer);

      await course?.save();
      if(req.user?._id === question.user._id){
        await NotificationModel.create({
          user: req.user?._id,
          title: "New Question Recived",
          message: `You have a new question in ${courseContent?.title}`,
      });
      }else{
        const data = {
          name: question.user.name,
          title: courseContent.title,
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandeler(error.message, 500));
    }
  }
);

// add review in course
interface IAddReviewData {
  review: string;
  courseId: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;

      const courseId = req.params.id;

      // check if the courseId exist in user's courses
      const courseExists = userCourseList?.some(
        (course: any) => course.courseId === courseId
      );
      
      if (!courseExists) {
        return next(
          new ErrorHandeler("You have not purchased this course", 400)
        );
      }
      
      const course = await CourseModel.findById(courseId);

      const { review, rating }: IAddReviewData = req.body;

      const reviewData: any = {
        user: req.user,
        rating,
        comment: review,
      };

      course?.reviews.push(reviewData);

      let avg = 0;

      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
        course.ratings = avg / course?.reviews.length;
      }

      await course?.save();

      const notification = {
        title: "New Review Recive",
        message: `You have recived a new review on ${course?.name} by ${req.user?.name}`,
      };

      // create notification

      res.status(200).json({
        success: true,
        message: "Review added successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandeler(error.message, 500));
    }
  }
);

// add reply in review
interface IAddReviewData {
  courseId: string;
  comment: string;
  reviewId: string;
}
export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, comment, reviewId }: IAddReviewData =
        req.body as IAddReviewData;

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandeler("Course not found", 400));
      }
      const review = course?.reviews.find(
        (rev: any) => rev._id.toString() === reviewId
      );

      if (!review) {
        return next(new ErrorHandeler("Review not found", 400));
      }

      const replyData: any = {
        user: req.user,
        comment,
      };

      if (!review.commentReply) {
        review.commentReply = [];
      }

      review.commentReply?.push(replyData);

      await course.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandeler(error.message, 500));
    }
  }
);

// get all courses -- only for admin
export const getAllcourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandeler(error.message, 400));
    }
  }
);

// delete course --- only for admin
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const course = await CourseModel.findById(id);
      if (!course) {
        return next(new ErrorHandeler("Course not found", 400));
      }

      await course.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandeler(error.message, 400));
    }
  }
);

// upload video for course content
export const uploadVideo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Upload video request received");
      console.log("Request file:", req.file);
      
      if (!req.file) {
        return next(new ErrorHandeler("Video file is required", 400));
      }
      
      const filename = req.file.filename;
      // Ensure URL is properly formatted without api/v1
      const serverUrl = (process.env.SERVER_URL || 'http://localhost:8000').replace(/\/api\/v1\/?$/, '');
      const fileUrl = `${serverUrl}/uploads/videos/${filename}`;
      
      console.log("Video uploaded successfully:", fileUrl);
      
      res.status(200).json({
        success: true,
        videoUrl: fileUrl,
      });
    } catch (error: any) {
      console.error("Error in uploadVideo:", error);
      return next(new ErrorHandeler(error.message, 500));
    }
  }
);
