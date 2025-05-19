import express from "express";
import {
  activateUser,
  deleteUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updateAvatar,
  updateUserInfo,
  updateUserPassword,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", isAuthenticated, logoutUser);

userRouter.get("/refresh", updateAccessToken);

userRouter.get("/me", isAuthenticated, getUserInfo);

userRouter.post("/social-auth", socialAuth);

userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);

userRouter.put("/update-user-password", isAuthenticated, updateUserPassword);

userRouter.put("/update-user-avatar", isAuthenticated, updateAvatar);

userRouter.get(
  "/get-users",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUsers
);

userRouter.put(
  "/update-user",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);

userRouter.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

// Debug endpoint to check user courses
userRouter.get(
  "/me/courses",
  isAuthenticated,
  (req, res) => {
    try {
      const user = req.user;
      res.status(200).json({
        success: true,
        courses: user?.courses || [],
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Debug endpoint to check user courses with detailed information
userRouter.get(
  "/debug-courses/:courseId",
  isAuthenticated,
  (req, res) => {
    try {
      const user = req.user;
      const courseId = req.params.courseId;
      
      // Check if the course exists in the user's courses array
      const courseExists = user?.courses?.some(
        (course: any) => course.courseId === courseId
      );
      
      // Get the courses array for debugging
      const coursesArray = user?.courses?.map((course: any) => ({
        courseId: course.courseId,
        courseIdType: typeof course.courseId,
        isMatch: course.courseId === courseId
      }));
      
      res.status(200).json({
        success: true,
        courseId,
        courseIdType: typeof courseId,
        courses: user?.courses || [],
        coursesDetailed: coursesArray,
        isPurchased: courseExists,
        user: {
          _id: user?._id,
          name: user?.name,
          email: user?.email
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default userRouter;
