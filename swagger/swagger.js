/**
 * ============================================================
 * File: swagger.js
 * ------------------------------------------------------------
 * Purpose:
 * This file configures Swagger (OpenAPI 3.0) documentation
 * for the E-Commerce backend.
 *
 * Responsibilities:
 * - Define API metadata (title, version, description)
 * - Define server environments (local & production)
 * - Configure authentication (JWT Bearer token)
 * - Define reusable request/response schemas
 * - Scan route files for Swagger JSDoc comments
 *
 * Swagger UI is exposed via /api/docs
 * ============================================================
 */

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

/**
 * Swagger configuration options
 */
const options = {
  definition: {
    openapi: "3.0.0",

    /**
     * Basic API information
     */
    info: {
      title: "E-Commerce API Documentation",
      version: "1.0.0",
      description:
        "Comprehensive API documentation for the E-Commerce backend application",
    },

    /**
     * Server environments
     */
    servers: [
      {
        url: "http://localhost:10000",
        description: "Local Development Server",
      },
      {
        url: "https://ecommerce-backend-hen7.onrender.com",
        description: "Production Server",
      },
    ],

    /**
     * Reusable components
     */
    components: {
      /**
       * JWT Authentication configuration
       */
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      /**
       * Schema definitions used across APIs
       */
      schemas: {
        /**
         * -------------------------
         * USER & AUTH SCHEMAS
         * -------------------------
         */
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            isAdmin: { type: "boolean" },
          },
        },

        RegisterInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          },
        },

        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
        },

        Address: {
          type: "object",
          properties: {
            name: { type: "string" },
            street: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            zip: { type: "string" },
            phone: { type: "string" },
            country: { type: "string" },
          },
        },

        /**
         * -------------------------
         * PRODUCT SCHEMA
         * -------------------------
         */
        Product: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            category: { type: "string" },
            image: { type: "string" },
            countInStock: { type: "number" },
            rating: {
              type: "object",
              properties: {
                rate: { type: "number" },
                count: { type: "number" },
              },
            },
            isDraft: { type: "boolean" },
          },
        },

        /**
         * -------------------------
         * CART SCHEMAS
         * -------------------------
         */
        CartItem: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            product: { $ref: "#/components/schemas/Product" },
            qty: { type: "number" },
          },
        },

        AddCartInput: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: { type: "string" },
            qty: { type: "number", default: 1 },
          },
        },

        /**
         * -------------------------
         * FAVORITES SCHEMAS
         * -------------------------
         */
        Favorite: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            product: { $ref: "#/components/schemas/Product" },
          },
        },

        AddFavoriteInput: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: { type: "string" },
          },
        },

        /**
         * -------------------------
         * ORDER SCHEMAS
         * -------------------------
         */
        OrderItem: {
          type: "object",
          properties: {
            name: { type: "string" },
            qty: { type: "number" },
            image: { type: "string" },
            price: { type: "number" },
            product: { type: "string" },
          },
        },

        OrderInput: {
          type: "object",
          required: ["orderItems", "shippingAddress", "paymentMethod"],
          properties: {
            orderItems: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
            shippingAddress: {
              type: "object",
              properties: {
                address: { type: "string" },
                city: { type: "string" },
                postalCode: { type: "string" },
                country: { type: "string" },
              },
            },
            paymentMethod: { type: "string" },
            itemsPrice: { type: "number" },
            taxPrice: { type: "number" },
            shippingPrice: { type: "number" },
            totalPrice: { type: "number" },
          },
        },

        OrderResponse: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            status: {
              type: "string",
              enum: [
                "Placed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
              ],
            },
            isPaid: { type: "boolean" },
            paidAt: { type: "string", format: "date-time" },
            totalPrice: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
          },
        },

        /**
         * -------------------------
         * PAYMENT SCHEMA
         * -------------------------
         */
        PaymentInput: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product: { type: "string" },
                  qty: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
  },

  /**
   * Swagger scans ONLY route files
   */
  apis: ["./routes/*.js"],
};

// Generate Swagger specification
const swaggerSpec = swaggerJSDoc(options);

// Export Swagger UI middleware
export { swaggerUi, swaggerSpec };
