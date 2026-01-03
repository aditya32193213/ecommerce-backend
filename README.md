# 🛒 E-Commerce Backend Application 
Node.js | Express.js | MongoDB | Mongoose | Swagger | MVC Architecture

This project is a production-ready backend for an E-Commerce application, built as part of the Full Stack curriculum (Module-4).
It powers a complete shopping experience by exposing RESTful APIs for Products, Categories, Cart, Favorites, Orders, Authentication, and Payments, and is designed to integrate seamlessly with the frontend developed in Module-3 (Ecommerce Website).

The backend follows clean architecture principles, uses modular MVC structure, includes input validation, centralized error handling, logging, and provides interactive API documentation via Swagger (OpenAPI 3.0).

---

# 🌐 Live Backend API  
- 🔗 **[https://ecommerce-backend-hen7.onrender.com](https://ecommerce-backend-hen7.onrender.com)**

---

# 📄 API Documentation (Swagger)
- Implemented using swagger-jsdoc and swagger-ui-express
- Covers:
- Routes
- Request parameters
- Request bodies
- Enables easy testing without Postman

Response schemas
- 🔗 **[https://ecommerce-backend-hen7.onrender.com/api/docs](https://ecommerce-backend-hen7.onrender.com/api/docs)**

---

### 📸 Swagger Screenshots

#### 1. Swagger Overview
Displays all available API endpoints grouped by modules such as Auth, Products, Cart, Orders, Payments, and Users.

> ![Swagger Overview Screenshot](./screenshots/swagger-overview.png)

#### 2. Authorization using JWT
Shows JWT bearer authentication configuration for accessing protected APIs.

> ![Swagger Authorization Screenshot](./screenshots/swagger-authorization.png)

#### 3. API Testing using “Try it out”
Demonstrates real-time API testing directly from Swagger UI.

> ![Swagger Try it out Screenshot](./screenshots/swagger-try-it-out.png)

### 🛡 Security
Protected routes are secured using JWT-based authentication and role-based access control.


---

## 🚀 Project Scope & Functional Coverage

### 🛍️ Product Management
- Fetch all products
- Fetch products category-wise
-Admin-only product creation, update, and deletion
-Draft product handling for admin workflows

### 🧺 Cart Management
- Add products to cart
- Fetch user cart items
- Update product quantity
- Remove items from cart  

### ❤️ Favorites / Wishlist  
- Add product to favorites
-Fetch all favorite products
- Remove from favorites 

### 👤 User & Authentication
- User registration & login (JWT-based authentication)
- Role-based access control (Admin / User)
- Secure protected routes

### 💳 Orders & Payments
- Create orders (COD & Stripe)
- Secure Stripe payment intent flow
- Order history & order details
- Invoice generation support

### 🧪 Validation
- Request validation using middleware (e.g., productId, quantity)
- Prevents invalid MongoDB ObjectId crashe

### ❌ Error Handling
- Centralized error-handling middleware
- Consistent HTTP status codes and messages

### 🪵 Logging
- Request logging via morgan
- Custom logger for descriptive runtime messages
- Useful for debugging and monitoring API activity

### 🚀 Deployment
- Backend Hosting: Render
- Frontend Hosting: Vercel / Netlify
- CI/CD: GitHub-connected auto deployments

The application is cloud-hosted and fully accessible as required by the rubric.

### 🌱 Seed Data

- Sample product data is provided for development using a seed script.
- This helps quickly populate the database during testing.

---

## 🧱 Project Architecture & 📁 Folder Structure

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
-  app.js handles only request/response & middleware
-  index.js handles server startup and DB connection

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
- pdfkit (Invoice Generation)
- Morgan  (Request Logging)
- Winston (Logging)
- Helmet(Security Headers)

---

### 🔗 API Endpoints Overview 

| Functionality            | Method | Endpoint                  |
| ------------------------ | ------ | ------------------------- |
| Get all products         | GET    | `/api/products`           |
| Get products by category | GET    | `/api/products/:category` |
| Add to cart              | POST   | `/api/cart`               |
| Get cart items           | GET    | `/api/cart`               |
| Add to favorites         | POST   | `/api/favorites`          |
| Get favorites            | GET    | `/api/favorites`          |


- A complete and interactive list is available in Swagger documentation.
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

### 🎥 Video Demonstration
- A short demo video is provided to showcase:
- API functionality
- Swagger testing
- Backend-frontend integration
- Deployment verification

(Link to be added)

---

### 🧠 Key Highlights (For Evaluators)

- Clean MVC architecture
- Proper separation of concerns
- Secure authentication & authorization
- API schema documentation with Swagger
- Logging, validation, and error handling
- Cloud deployment with public access

---

### 👨‍💻 Author

Aditya
Full Stack Developer (MERN)
Backend Project -ecommerce backend
