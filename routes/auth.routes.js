const express = require("express");
const multer = require("multer");
const registerController = require("../controllers/auth/register.controller");
const upload = multer({ dest: "./temp/uploads/" });

const authRoute = express.Router();

//route for registering user
/**
 * @swagger
 * /register:
 *  post:
 *      summary: Register  user
 *      tags:
 *          - auth
 *      parameters:
 *          -   in: body
 *              name: regNoOrCode
 *              required: true
 *              schema:
 *                  type: string
 *              description: For a lecturer, this is the lecturer code, for a student, this is the reg number
 *          -   in: body
 *              name: email
 *              required: true
 *              schema:
 *                  type: string
 *              description: This is the person's email
 *          -   in: body
 *              name: firstName
 *              required: true
 *              schema:
 *                  type: string
 *              description: This is the person's first name
 *          -   in: body
 *              name: lastName
 *              required: true
 *              schema:
 *                  type: string
 *              description: This is the person's last name
 *          -   in: body
 *              name: password
 *              required: true
 *              schema:
 *                  type: string
 *              description: This is the person's password
 *          -   in: body
 *              name: department
 *              required: true
 *              schema:
 *                  type: string
 *              description: This is the user's department
 *          -   in: body
 *              name: role
 *              required: true
 *              schema:
 *                  type: string
 *              description: This should be either "lecturer" or "student"
 *          -   in: body
 *              name: avatar
 *              required: false
 *              schema:
 *                  type: string
 *              description: This is the avatar of the user
 *      responses:
 *          200:
 *              description: User registered successfully
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

authRoute.use(upload.single("avatar"));
authRoute.post("/register", registerController.register_student);

//route for registering user
/**
 * @swagger
 * /register-verify/{id}:
 *  post:
 *      summary: Verify  user
 *      tags:
 *          - auth
 *      parameters:
 *          -   in: body
 *              name: email
 *              required: true
 *              schema:
 *                  type: string
 *              description: The user email
 *          -   in: body
 *              name: code
 *              required: true
 *              schema:
 *                  type: string
 *              description: The verification code
 *      responses:
 *          200:
 *              description: User verified successfully
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

authRoute.post("/register-verify", registerController.verify_user);

/**
 * @swagger
 * /resend-verify-email/{id}:
 *  post:
 *      summary: To resend verification email
 *      tags:
 *          - auth
 *      parameters:
 *          -   in: body
 *              name: email
 *              required: true
 *              schema:
 *                  type: string
 *              description: The user email
 *      responses:
 *          200:
 *              description: User verified successfully
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

authRoute.post("/resend-verify-email", registerController.resend_email);

module.exports = authRoute;
