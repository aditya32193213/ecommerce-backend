// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import productRoutes from "./routes/productRoutes.js";
// import cartRoutes from "./routes/cartRoutes.js";
// import favoriteRoutes from "./routes/favoriteroutes.js";

// const app=express();

// //Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));

// //Routes
// app.use("/api/products", productRoutes);
// app.use("/api/cart",cartRoutes);
// app.use("/api/favorite",favoriteRoutes);

// //Base Route
// app.get("/",(req,res)=>{
//     res.status(200).send("Welcome to the E-commerce API 🚀 ")
// });

// export default app;



import express from "express";
import cors from "cors";
import morgan from "morgan";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import favoriteRoutes from "./routes/favoriteroutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./middleware/logger.js";
import { swaggerUi, swaggerSpec } from "./swagger/swagger.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(logger);

// Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API 🚀");
});

// Error handling middleware
app.use(errorHandler);

export default app;
