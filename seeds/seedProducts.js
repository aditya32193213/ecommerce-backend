// src/seed/seedProducts.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Product from "../models/productModel.js"; // adjust path if your model is elsewhere
import connectDB from "../config/db.js"; // adjust if your db.js path differs
import products from "../data/products.js";


async function seed() {
  try {
    await connectDB(); // from your src/config/db.js
    console.log("Connected to DB — seeding products...");

    // Clear existing products (optional)
    await Product.deleteMany({});
    console.log("Cleared existing products.");

    // Insert the new products
    const inserted = await Product.insertMany(products);
    console.log(`Inserted ${inserted.length} products.`);

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();

