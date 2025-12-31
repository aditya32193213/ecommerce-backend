import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API Documentation",
      version: "1.0.0",
      description: "API documentation for the E-commerce backend"
    },
    servers: [
      { url: "http://localhost:10000", description: "Localhost" },
      { url: "https://ecommerce-backend-hen7.onrender.com", description: "Production Server" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // --- AUTH & USERS ---
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            isAdmin: { type: "boolean" },
            token: { type: "string" }
          }
        },
        RegisterInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" }
          }
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            password: { type: "string" }
          }
        },
        
        // --- PRODUCTS ---
        Product: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            price: { type: "number" },
            category: { type: "string" },
            image: { type: "string" },
            countInStock: { type: "number" }
          }
        },

        // --- CART & FAVORITES ---
        CartItem: {
            type: "object",
            properties: {
              product: { $ref: "#/components/schemas/Product" },
              qty: { type: "number" }
            }
        },
        AddCartInput: {
            type: "object",
            required: ["productId"],
            properties: {
              productId: { type: "string" },
              qty: { type: "number", default: 1 }
            }
        },
        AddFavoriteInput: {
            type: "object",
            required: ["productId"],
            properties: {
              productId: { type: "string" }
            }
        },
        Favorite: {
            type: "object",
            properties: {
              _id: { type: "string" },
              product: { $ref: "#/components/schemas/Product" }
            }
        },

        // --- ORDERS ---
        OrderInput: {
            type: "object",
            properties: {
                orderItems: { 
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            product: { type: "string" },
                            qty: { type: "number" }
                        }
                    }
                },
                shippingAddress: {
                    type: "object",
                    properties: {
                        address: { type: "string" },
                        city: { type: "string" },
                        postalCode: { type: "string" },
                        country: { type: "string" }
                    }
                },
                paymentMethod: { type: "string" },
                totalPrice: { type: "number" }
            }
        },
        PaymentInput: {
            type: "object",
            properties: {
                items: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                             product: { type: "string" },
                             qty: { type: "number" }
                        }
                    }
                }
            }
        }
      }
    }
  },
  apis: ["./routes/*.js", "./controllers/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi, swaggerSpec };