/**
 * ============================================================
 * File: seedProducts.js
 * ------------------------------------------------------------
 * Purpose:
 * This script seeds sample product data into the database.
 *
 * It is used during development to quickly populate
 * the Products collection with initial data.
 *
 * IMPORTANT:
 * - This script assumes at least one Admin user exists
 * - Products are linked to the Admin user as creator
 * ============================================================
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import connectDB from "../config/db.js";
import products from "../data/products.js";

dotenv.config();

/**
 * Seed function
 */
async function seed() {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to DB — seeding...");

    /**
     * 1️⃣ Remove existing products
     * This ensures clean seeding without duplicates
     */
    await Product.deleteMany({});

    /**
     * 2️⃣ Find an Admin user
     * Products must be associated with an admin creator
     */
    const adminUser = await User.findOne({ isAdmin: true });

    if (!adminUser) {
      console.error(
        "❌ Error: No Admin user found. Create an Admin user before seeding."
      );
      process.exit(1);
    }

    /**
     * 3️⃣ Attach admin ID to each product
     */
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser._id };
    });

    /**
     * 4️⃣ Insert products into database
     */
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully inserted ${inserted.length} products.`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
