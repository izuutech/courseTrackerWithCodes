require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("../swaggerConfig");

const MONGO_URI = process.env.MONGO_URI;
// const MONGO_URI = process.env.LOCAL_MONGO_URI;

const PORT = process.env.PORT || 4000;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`server running on ${PORT}`));
  })
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: true,
    optionsSuccessStatus: 204,
  })
);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//parse json
app.use(bodyParser.json());

app.use(
  "/api-docs",
  // process.env.STAGE === "development"
  //   ? swaggerUi.serve
  //   : (req, res) => successReq(res, null, "hi"),
  swaggerUi.setup(swaggerDocs)
);

//route to read a notification
/**
 * @swagger
 * /:
 *  get:
 *       description: The home route
 *       responses:
 *           '200':
 *              description: Notification content was successfully delivered to client
 */

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello", err: null, data: null });
});

// general
const authRoute = require("../routes/auth.routes");
const courseRoute = require("../routes/course.routes");
const attendanceRoute = require("../routes/attendance.routes");
const userRoute = require("../routes/user.routes");

//general
app.use("/", authRoute);
app.use("/courses", courseRoute);
app.use("/attendance", attendanceRoute);
app.use("/user", userRoute);

app.use((req, res) => {
  res.status(404).json({ message: "not found", err: null, data: null });
});

module.exports = app;
