
import { Redis } from "@upstash/redis";

let redis: any;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} else {
  // Dummy redis object with no-op methods
  redis = {
    get: async () => null,
    set: async () => undefined,
    del: async () => undefined,
    // Add more methods as needed
  };
}

export default redis;