const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Course Tracker Backend API",
      description: "This is the backend api of Affiliate Website",
      contact: {
        name: "Joshua Izu",
      },
      servers: ["http://localhost:4000"],
    },
  },
  apis: ["./api/server.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
