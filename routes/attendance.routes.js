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
 * /attendance/mark/{barcodeId}:
 *  put:
 *      summary: Mark attendance for a course
 *      tags:
 *          - attendance
 *      parameters:
 *          -   in: params
 *              name: barcodeId
 *              required: true
 *              schema:
 *                  type: string
 *              description: unique id encrypted on the barcode
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

attendanceRoute.put(
  "/mark/:barcodeId",
  requireStudent,
  attendanceController.markAttendance
);

/**
 * @swagger
 * /attendance/{courseId}:
 *  post:
 *      summary: Create attendance or barcode id
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
