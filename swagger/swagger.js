import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"

const options ={
    definition: {
        openapi: "3.0.0",
        info:{
            title:"E-Commerce API",
            version: "1.0.0",
            description: "API documentation for the E-commerce backend"
        },
    },
    apis: ["./routes/*.js"], //Scan all files for docs
};

const swaggerSpec = swaggerJSDoc(options);

export {swaggerUi, swaggerSpec};