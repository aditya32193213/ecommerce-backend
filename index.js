import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

//Connecting to MongoDB
connectDB();

const PORT= process.env.PORT ||8080;

app.listen(PORT,()=>{
    console.log("server running on http://localhost:${PORT}");
});