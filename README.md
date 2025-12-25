# 🛍️ E-Commerce Backend  
Node.js | Express.js | MongoDB | Mongoose | Swagger | MVC Architecture

A robust, production-ready Node.js/Express backend for e-commerce applications, featuring secure payments, inventory management, and automated API documentation.
It provides APIs for **Products**, **Cart**, and **Favorites**, along with complete input validation, logging, error handling, and API documentation using Swagger (OpenAPI 3.0).

---

# 🌐 Live Backend API  
- 🔗 **[https://ecommerce-backend-hen7.onrender.com](https://ecommerce-backend-hen7.onrender.com)**

---

# 📄 API Documentation (Swagger)
- This interactive documentation is generated using swagger-jsdoc + swagger-ui-express.
- 🔗 **[https://ecommerce-backend-hen7.onrender.com/api/docs](https://ecommerce-backend-hen7.onrender.com/api/docs)**

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
## 📂 Project Structure

ecommerce-backend/
├── config/             # Database connection and environment validation
├── controllers/        # Business logic for all API endpoints
├── data/               # Static data files for seeding
├── middleware/         # Auth, Error handling, and Request logging
│   └── validators/     # Input validation logic
├── models/             # Mongoose schemas and data models
├── node_modules/       # Project dependencies
├── routes/             # Express route definitions with Swagger JSDoc
├── seeds/              # Database seeding scripts
├── swagger/            # Swagger/OpenAPI configuration
├── .env                # Environment variables (Private)
├── .gitignore          # Files to exclude from Git
├── app.js              # Express app configuration & middleware setup
├── index.js            # Server entry point & DB connection initialization
├── package-lock.json   # Locked versions of dependencies
├── package.json        # Project metadata and scripts
└── README.md           # Project documentation
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
- JSON Web Tokens (JWT) & Bcryptjs
- Stripe API
- Swagger-jsdoc & Swagger-ui-express

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
JWT_SECRET=your_super_secret_key
STRIPE_SECRET_KEY=sk_test_...
```
---

### Seed the database (Requires an Admin user in DB first)
```bash
npm run seed
```
---

### Start Server

### Development:
```bash
npm run dev
```

### Production
```bash
npm start
```
---

