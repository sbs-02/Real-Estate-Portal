import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Real Estate Portal API",
      version: "1.0.0",
      description: "API for the Real Estate Buyer Portal",
    },
    servers: [{ url: "http://localhost:8080/api" }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
      schemas: {
        Property: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            location: {
              type: "object",
              properties: {
                city: { type: "string" },
                state: { type: "string" },
              },
            },
            images: {
              type: "array",
              items: { type: "string" },
            },
            bedrooms: { type: "number" },
            bathrooms: { type: "number" },
            area: { type: "number" },
            propertyType: { type: "string" },
            listingType: {
              type: "string",
              enum: ["sale", "rent"],
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // scans your route files for JSDoc comments
};

export default swaggerJSDoc(options);
