const express = require("express");
const courseController = require("../controllers/course/course.controller");
const {
  requireLecturer,
  requireAuth,
  requireStudent,
} = require("../middleware/auth.middleware");

const courseRoute = express.Router();

/**
 * @swagger
 * /courses:
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
 *                  type: object
 *                  properties:
 *                      day:
 *                          type: string
 *                      startHour:
 *                          type: integer
 *                      startMinute:
 *                          type: integer
 *                      endHour:
 *                          type: integer
 *                      endMinute:
 *                          type: integer
 *                  example:
 *                      day: Monday
 *                      startHour: 12
 *                      startMinute: 45
 *                      endHour: 8
 *                      endMinute: 23
 *              description: This is the schedules of the course it should be an array of objects. The objects should have day,startHour,startMinute,endHour and endMinute
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

/**
 * @swagger
 * /courses:
 *  get:
 *      summary: Fetch all courses
 *      tags:
 *          - courses
 *      responses:
 *          200:
 *              description: Courses fetched successfully
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

courseRoute.get("/", requireAuth, courseController.fetch_all_courses);

/**
 * @swagger
 * /courses/toggle/lecturer/{id}:
 *  put:
 *      summary: Add or remove courses to a lecturer's course
 *      tags:
 *          - lecturer
 *      parameters:
 *          -   in: params
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: id of the course
 *      responses:
 *          200:
 *              description: Course added or removed successfully
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

courseRoute.put(
  "/toggle/lecturer/:id",
  requireLecturer,
  courseController.toggele_add_course_to_courses_for_lecturers
);

/**
 * @swagger
 * /courses/toggle/student/{id}:
 *  put:
 *      summary: Add or remove courses to a student's course
 *      tags:
 *          - lecturer
 *      parameters:
 *          -   in: params
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: id of the course
 *      responses:
 *          200:
 *              description: Course added or removed successfully
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

courseRoute.put(
  "/toggle/student/:id",
  requireStudent,
  courseController.toggele_add_course_to_courses_for_student
);

/**
 * @swagger
 * /courses/{id}:
 *  get:
 *      summary: Fetch single course
 *      tags:
 *          - courses
 *      parameters:
 *          -   in: params
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: id of the course or course code
 *      responses:
 *          200:
 *              description: Course fetched successfully
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

courseRoute.get("/:id", requireAuth, courseController.fetch_single_courses);

/**
 * @swagger
 * /courses/{id}:
 *  delete:
 *      summary: Delete a course
 *      tags:
 *          - courses
 *      parameters:
 *          -   in: params
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: _id of the course to be deleted
 *      responses:
 *          200:
 *              description: Course fetched successfully
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

courseRoute.delete("/:id", requireLecturer, courseController.delete_course);

module.exports = courseRoute;
