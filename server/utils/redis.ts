import { Redis } from "ioredis";
require("dotenv").config();

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log(`Redis connected`);
    return process.env.REDIS_URL;
  }
  throw new Error(`Redis Connection Failed`);
};

export const redis = new Redis(redisClient());
