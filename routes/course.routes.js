const express = require("express");
const courseController = require("../controllers/course/course.controller");
const { requireLecturer } = require("../middleware/auth.middleware");

const courseRoute = express.Router();

/**
 * @swagger
 * /course:
 *  post:
 *      summary: Create course
 *      tags:
 *          - courses
 *      parameters:
 *          -   in: body
 *              name: title
 *              required: true
 *              schema:
 *                  type: string
 *              description: Title of the course
 *          -   in: body
 *              name: courseCode
 *              required: true
 *              schema:
 *                  type: string
 *              description: This is the course code
 *          -   in: body
 *              name: courseType
 *              required: true
 *              schema:
 *                  type: string
 *              description: This is the course type
 *          -   in: body
 *              name: description
 *              required: false
 *              schema:
 *                  type: string
 *              description: This is the course description
 *          -   in: body
 *              name: venue
 *              required: true
 *              schema:
 *                  type: string
 *              description: This is the course venue
 *          -   in: body
 *              name: level
 *              required: true
 *              schema:
 *                  type: string
 *              description: This is the level for the course
 *          -   in: body
 *              name: schedules
 *              required: false
 *              schema:
 *                  type: string
 *              description: This is the schedules of the course it should be an array of objects. The objects should have startTime and endTime eg [{startTime:2023-08-09T17:45:41.251+0000,endTime:2023-08-09T17:45:41.251+0000}]
 *      responses:
 *          200:
 *              description: Course created successfully
 *          400:
 *              description: Bad request format
 *          401:
 *              description: Authentication failed
 *          403:
 *              description: Forbidden error (most likely due to authentication mismatch)
 *          404:
 *              description: Not found
 *          500:
 *              description: An operation failed.
 */

courseRoute.post("/", requireLecturer, courseController.create_course);

module.exports = courseRoute;
