# 🛍️ E-Commerce Backend  
Node.js | Express.js | MongoDB | Mongoose | Swagger | MVC Architecture

This is the backend service for the **E-Commerce Web Application** built as part of the Full Stack Development Capstone Project.  
It provides APIs for **Products**, **Cart**, and **Favorites**, along with complete input validation, logging, error handling, and API documentation using Swagger (OpenAPI 3.0).

---

## 🚀 Features

### ✅ Product APIs  
- Get all products  
- Get products by category  

### ✅ Cart APIs  
- Add product to cart  
- Get all cart items  
- Remove item from cart  

### ✅ Favorites APIs  
- Add product to favorites  
- Get all favorite items  

### ✅ System-Level Features  
- Input validation (productId, quantity)  
- Error handling middleware  
- Logging (morgan + custom logger)  
- Swagger API documentation  
- MVC folder structure  
- Environment variable support (`.env`)  

---

## 📁 Folder Structure

```plaintext
ecommerce-backend/
│
├── src/
│ ├── app.js
│ ├── index.js
│ │
│ ├── config/
│ │ └── db.js
│ │
│ ├── controllers/
│ │ ├── productController.js
│ │ ├── cartController.js
│ │ └── favoriteController.js
│ │
│ ├── models/
│ │ ├── productModel.js
│ │ ├── cartModel.js
│ │ └── favoriteModel.js
│ │
│ ├── routes/
│ │ ├── productRoutes.js
│ │ ├── cartRoutes.js
│ │ └── favoriteRoutes.js
│ │
│ ├── middleware/
│ │ ├── errorHandler.js
│ │ ├── logger.js
│ │ └── validators/
│ │ ├── cartValidator.js
│ │ └── favoriteValidator.js
│ │
│ └── swagger/
│ └── swagger.js
│
├── package.json
├── .env
└── README.md
```
---



# 🧩 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Swagger (OpenAPI 3.0)
- ES Modules
- MVC Architecture
- Nodemon (Development)

---

### ⚙️ Installation & Setup

## 1️⃣ Clone the Repository
```bash
git clone https://github.com/aditya32193213/ecommerce-backend.git
cd ecommerce-backend
```

### Install Dependencies
```bash
npm install
```

### Add Environment Variables
```bash
PORT=8080
MONGO_URI=your_mongodb_connection_string
```

### Start Server

### Development:
```bash
npm run dev
```

### Production
```bash
npm start
```


### 📘 API Documentation (Swagger UI)
- This interactive documentation is generated using swagger-jsdoc + swagger-ui-express.


