// import dotenv from "dotenv";
// import app from "./app.js";
// import connectDB from "./config/db.js";

// dotenv.config();

// //Connecting to MongoDB
// connectDB();

// const PORT= process.env.PORT ||8080;

// app.listen(PORT,()=>{
//     console.log("server running on http://localhost:${PORT}");
// });





import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 8080;

// Connect to DB, then start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
