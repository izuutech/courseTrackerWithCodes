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
  apis: [
    "./server.js",
    "./routes/auth.routes.js",
    "./routes/course.routes.js",
    "./routes/attendance.routes.js",
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
