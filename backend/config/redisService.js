import { createClient } from "redis";
import Session from "../models/SessionModel.js";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err) => {
  console.warn("⚠️ Redis client error:", err.message || err);
});

let isRedisConnected = false;

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("🚀 Connected to Redis successfully!");
    isRedisConnected = true;
  } catch (err) {
    console.error("❌ Failed to connect to Redis. Caching is disabled, falling back to direct DB lookups:", err.message);
    isRedisConnected = false;
  }
};

/**
 * Retrieve a session from cache. If not found (cache miss) or Redis is offline,
 * look it up in MongoDB and cache it.
 * @param {string} sid - The session ID
 * @returns {Promise<any>} The session document
 */
export const getCachedSession = async (sid) => {
  if (!sid) return null;

  // 1. Try fetching from Redis first
  if (isRedisConnected && redisClient.isOpen) {
    try {
      const cached = await redisClient.get(`session:${sid}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      console.warn("⚠️ Redis getCachedSession failed, falling back to DB:", err.message);
    }
  }

  // 2. Cache Miss or Redis Offline: Query MongoDB
  try {
    const dbSession = await Session.findById(sid);
    if (dbSession) {
      // Convert mongoose document to plain object
      const sessionObj = dbSession.toObject ? dbSession.toObject() : dbSession;

      // 3. Cache the retrieved session in Redis for 24 hours (86400 seconds)
      if (isRedisConnected && redisClient.isOpen) {
        try {
          await redisClient.setEx(`session:${sid}`, 86400, JSON.stringify(sessionObj));
        } catch (cacheErr) {
          console.warn("⚠️ Failed to write session to Redis cache:", cacheErr.message);
        }
      }
      return sessionObj;
    }
  } catch (dbErr) {
    console.error("❌ Error querying Session from DB:", dbErr);
  }

  return null;
};

/**
 * Explicitly save or update a session in the Redis cache.
 * @param {string} sid - The session ID
 * @param {any} sessionData - The session data to cache
 */
export const setCachedSession = async (sid, sessionData) => {
  if (!sid || !sessionData) return;

  if (isRedisConnected && redisClient.isOpen) {
    try {
      const sessionObj = sessionData.toObject ? sessionData.toObject() : sessionData;
      await redisClient.setEx(`session:${sid}`, 86400, JSON.stringify(sessionObj));
    } catch (err) {
      console.warn("⚠️ Redis setCachedSession failed:", err.message);
    }
  }
};

/**
 * Delete a session from the Redis cache.
 * @param {string} sid - The session ID
 */
export const deleteCachedSession = async (sid) => {
  if (!sid) return;

  if (isRedisConnected && redisClient.isOpen) {
    try {
      await redisClient.del(`session:${sid}`);
    } catch (err) {
      console.warn("⚠️ Redis deleteCachedSession failed:", err.message);
    }
  }
};
