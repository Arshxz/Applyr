import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (
  redisUrl &&
  redisToken &&
  redisUrl.trim() !== "" &&
  redisToken.trim() !== ""
) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
} else if (process.env.NODE_ENV === "production") {
  throw new Error("Missing Upstash Redis environment variables in production");
}

export { redis };
