const express = require("express");
const multer = require("multer");
const userController = require("../controllers/user/user.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const upload = multer({ dest: "./temp/uploads/" });

const userRoute = express.Router();

/**
 * @swagger
 * /user:
 *  get:
 *      summary: Fetch user details
 *      tags:
 *          - user
 *      responses:
 *          200:
 *              description: User fetched  successfully
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

userRoute.get("/", requireAuth, userController.fetch_user);

/**
 * @swagger
 * /user/all:
 *  get:
 *      summary: Fetch all users
 *      tags:
 *          - user
 *      responses:
 *          200:
 *              description: Users fetched  successfully
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

userRoute.get("/all", userController.fetch_all_users);

/**
 * @swagger
 * /user:
 *  put:
 *      summary: Change  user password
 *      tags:
 *          - user
 *      parameters:
 *          -   in: body
 *              name: lastName
 *              required: false
 *              schema:
 *                  type: string
 *              description: This is the person's last name
 *          -   in: body
 *              name: firstName
 *              required: false
 *              schema:
 *                  type: string
 *              description: This is the person's first name
 *          -   in: body
 *              name: avatar
 *              required: false
 *              schema:
 *                  type: string
 *              description: This is the person's avatar
 *      responses:
 *          200:
 *              description: User profile updated successfully
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
// userRoute.use(upload.single("avatar"));
userRoute.put("/", requireAuth, userController.modify_user);

/**
 * @swagger
 * /user/change-password:
 *  put:
 *      summary: Change  user password
 *      tags:
 *          - user
 *      parameters:
 *          -   in: body
 *              name: password
 *              required: true
 *              schema:
 *                  type: string
 *              description: This is the person's old password
 *          -   in: body
 *              name: newPassword
 *              required: true
 *              schema:
 *                  type: string
 *              description: This is the person's new password
 *      responses:
 *          200:
 *              description: User password changed successfully
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

userRoute.put("/change-password", requireAuth, userController.change_password);

module.exports = userRoute;
