import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
  uploadVideo,
} from "../controllers/course.controller";
import { uploadThumbnail, uploadVideo as uploadVideoMiddleware } from "../middleware/fileUpload";

const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  // isAuthenticated,
  // authorizeRoles("admin"),
  uploadThumbnail.single("thumbnail"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadThumbnail.single("thumbnail"),
  editCourse
);

courseRouter.post(
  "/upload-video",
  // isAuthenticated,
  // authorizeRoles("admin"),
  uploadVideoMiddleware.single("video"),
  uploadVideo
);

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

courseRouter.put("/add-question/", isAuthenticated, addQuestion);

courseRouter.put("/add-answer/", isAuthenticated, addAnswer);

courseRouter.put("/add-review/:id", isAuthenticated, addReview);

courseRouter.put(
  "/add-reply",
  isAuthenticated,
  authorizeRoles("admin"),
  addReplyToReview
);

courseRouter.get(
  "/get-courses",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllCourses
);

courseRouter.get("/get-public-courses", getAllCourses);

courseRouter.delete(
  "/delete-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);


export default courseRouter;
