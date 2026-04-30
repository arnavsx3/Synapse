import { Redis } from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL");
}

export const redisConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});
