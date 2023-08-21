const express = require("express");
const attendanceController = require("../controllers/course/attendance.controller");
const {
  requireLecturer,
  requireAuth,
  requireStudent,
} = require("../middleware/auth.middleware");

const attendanceRoute = express.Router();

/**
 * @swagger
 * /attendance/mark/{attendanceId}:
 *  put:
 *      summary: Mark attendance for a course
 *      tags:
 *          - attendance
 *      parameters:
 *          -   in: params
 *              name: attendanceId
 *              required: true
 *              schema:
 *                  type: string
 *              description: id of the attendance to be marked
 *          -   in: body
 *              name: code
 *              required: true
 *              schema:
 *                  type: string
 *              description: code of the attendance to be marked and used
 *      responses:
 *          200:
 *              description: Attendance marked successfully
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

attendanceRoute.put(
  "/mark/:attendanceId",
  requireStudent,
  attendanceController.markAttendance
);

/**
 * @swagger
 * /attendance/add/{id}:
 *  put:
 *      summary: Add student to an attendance (should be done by lecturer)
 *      tags:
 *          - attendance
 *      parameters:
 *          -   in: params
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: id of the attendance
 *          -   in: body
 *              name: studentIds
 *              required: true
 *              schema:
 *                  type: array
 *              description: array of each user id to add
 *      responses:
 *          200:
 *              description: Student added successfully
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

attendanceRoute.put(
  "/add/:id",
  requireLecturer,
  attendanceController.add_student_to_attendance
);

/**
 * @swagger
 * /attendance/single/{attendanceId}:
 *  get:
 *      summary: Fetch a single attendance
 *      description : To get the total number of students registered, simply do attendance.course.students
 *      tags:
 *          - attendance
 *      parameters:
 *          -   in: params
 *              name: attendanceId
 *              required: true
 *              schema:
 *                  type: string
 *              description: id of the attendance
 *      responses:
 *          200:
 *              description: Attendance fetched successfully
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

attendanceRoute.get(
  "/single/:attendanceId",
  requireAuth,
  attendanceController.fetch_single_attendance
);

/**
 * @swagger
 * /attendance/{courseId}:
 *  get:
 *      summary: Fetch all attendance for a course
 *      description : To get the total number of students registered, simply do attendance.course.students
 *      tags:
 *          - attendance
 *      parameters:
 *          -   in: params
 *              name: courseId
 *              required: true
 *              schema:
 *                  type: string
 *              description: id of the course
 *      responses:
 *          200:
 *              description: Attendance fetched successfully
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

attendanceRoute.get(
  "/:courseId",
  requireAuth,
  attendanceController.fetch_all_attendance_for_single_course
);

/**
 * @swagger
 * /attendance/{courseId}:
 *  post:
 *      summary: Create attendance and the pins
 *      tags:
 *          - attendance
 *      parameters:
 *          -   in: params
 *              name: courseId
 *              required: true
 *              schema:
 *                  type: string
 *              description: id of the course
 *          -   in: body
 *              name: numOfCodes
 *              required: true
 *              schema:
 *                  type: string
 *              description: number of codes to be created
 *          -   in: body
 *              name: customDate
 *              required: false
 *              schema:
 *                  type: string
 *              description: custom date. should be of date iso string. TO do it you can creat a new date and do .toISOString()
 *      responses:
 *          200:
 *              description: Barcode id created successfully
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

attendanceRoute.post(
  "/:courseId",
  requireLecturer,
  attendanceController.create_attendance
);

module.exports = attendanceRoute;
