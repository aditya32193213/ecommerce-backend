/**
 * ============================================================
 * File: db.js
 * ------------------------------------------------------------
 * Purpose:
 * Establishes connection to MongoDB
 *
 * Performs:
 * - Environment validation
 * - Safe connection handling
 * - Graceful failure on error
 * ============================================================
 */

import mongoose from "mongoose";

const connectDB = async () => {
  // Ensure critical environment variables exist
  const requiredEnvs = ["MONGO_URI", "JWT_SECRET", "STRIPE_SECRET_KEY"];
  const missing = requiredEnvs.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    console.error(`❌ Missing Environment Variables: ${missing.join(", ")}`);
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
