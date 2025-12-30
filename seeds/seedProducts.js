import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Product from "../models/productModel.js";
import User from "../models/userModel.js"; 
import connectDB from "../config/db.js";
import products from "../data/products.js";

async function seed() {
  try {
    await connectDB();
    console.log("Connected to DB — seeding...");

    // 1. Clear existing products
    await Product.deleteMany({});
    
    // 2. Fetch the Admin User
    // We look for ANY user with isAdmin: true
    const adminUser = await User.findOne({ isAdmin: true });

    if (!adminUser) {
        console.error("❌ Error: No Admin user found. You must register a user and make them Admin first.");
        process.exit(1);
    }

    // 3. Attach Admin ID to every product
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser._id };
    });

    // 4. Insert
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Success! Inserted ${inserted.length} products.`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();