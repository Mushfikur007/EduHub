// Make sure to load environment variables first
import * as dotenv from "dotenv";
dotenv.config();
console.log("Environment variables loaded");

// Then import the rest of the modules
import { app } from "./app";
import connectDB from "./utils/db";
import { v2 as cloudinary } from "cloudinary";

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is connected with port ${PORT}`);
  connectDB();
});
