import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 10000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // 🛡️ CRASH PROOFING: Handle Unhandled Promise Rejections
    // (e.g., if MongoDB password changes or connection drops)
    process.on("unhandledRejection", (err, promise) => {
      console.error(`❌ Unhandled Rejection: ${err.message}`);
      // Close server & exit process to allow a restart (by Docker/Render)
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();