import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "E-Commerce API Documentation",
      version: "1.0.0",
      description: "API documentation for the E-commerce backend using Swagger (OpenAPI 3.0)"
    },

    servers: [
      {
        url: "http://localhost:8080",
        description: "Local Development Server"
      }
    ],

    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", description: "MongoDB ObjectId" },
            title: { type: "string", description: "Product title" },
            price: { type: "number", description: "Product price" },
            category: { type: "string", description: "Product category" },
            image: { type: "string", description: "Product image URL" },
            description: { type: "string", description: "Product description" },
            rating: { type: "number", description: "Product rating" }
          }
        },

        CartItem: {
          type: "object",
          properties: {
            _id: { type: "string", description: "Cart item ID" },
            product: { $ref: "#/components/schemas/Product" },
            qty: { type: "number", description: "Quantity of product" }
          }
        },

        Favorite: {
          type: "object",
          properties: {
            _id: { type: "string", description: "Favorite item ID" },
            product: { $ref: "#/components/schemas/Product" }
          }
        },

        AddCartInput: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: { type: "string", description: "Product ObjectId" },
            qty: { type: "number", description: "Quantity", default: 1, minimum: 1 }
          }
        },

        AddFavoriteInput: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: { type: "string", description: "Product ObjectId" }
          }
        }
      }
    }
  },

  // JSDoc scanning paths
  apis: [
    "./routes/*.js",
    "./src/routes/*.js",
    "./src/controllers/*.js"
  ]
};

// Generate Swagger specification
const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
