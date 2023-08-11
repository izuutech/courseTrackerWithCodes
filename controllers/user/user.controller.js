const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const { User } = require("../../models/User");
const handlePromise = require("../../utils/handlePromise.utils");
const {
  serverError,
  successReq,
  reqError,
} = require("../../utils/responses.utils");

const change_password = async (req, res) => {
  const body = req.body;
  if (body.password && body.newPassword) {
    const [user, userErr] = await handlePromise(
      User.findById(res?.locals?.user?._id)
    );
    if (user) {
      bcrypt.compare(
        body.password,
        user.password,
        async function (err, result) {
          if (result == true) {
            bcrypt.hash(body.newPassword, 10, async (hashErr, hash) => {
              if (hashErr) {
                serverError(res, null, "Something went wrong");
              } else {
                const [updateUser, updateUserErr] = await handlePromise(
                  User.findByIdAndUpdate(
                    user._id,
                    { password: hash },
                    { returnDocument: "after" }
                  )
                );
                if (updateUser) {
                  successReq(res, null, "Password changed successfully");
                } else {
                  serverError(
                    res,
                    updateUserErr,
                    "Could not update your password"
                  );
                }
              }
            });
          } else {
            reqError(res, err, "Old password is incorrect");
          }
        }
      );
    } else {
      serverError(res, null, "Cannot fetch your data");
    }
  } else {
    reqError(res, null, "Please provide old and new passwords");
  }
};

cloudinary.config({
  cloud_name: "dyx2e9ox4",
  api_key: "348882827666355",
  api_secret: "Q-wYSL5K2j0J3bLWGMgU5mTzTuE",
});

const change_user_details = async (res, user, body, result) => {
  const [updateUser, updateUserErr] = await handlePromise(
    User.findByIdAndUpdate(
      user._id,
      {
        avatar: result ? result.secure_url : undefined,
        firstName: body.firstName || user.firstName,
        lastName: body.lastName || user.lastName,
      },
      { returnDocument: "after" }
    )
  );
  if (updateUser) {
    successReq(
      res,
      { ...updateUser, password: null },
      "Profile updated successfully"
    );
  } else {
    serverError(res, updateUserErr, "Could not update your data");
  }
};

const modify_user = async (req, res) => {
  const body = req.body;
  const user = res.locals.user;
  if (req.file) {
    cloudinary.v2.uploader.upload(
      req.file.path,
      { public_id: req.file.filename },
      async function (error, result) {
        if (error) {
          serverError(res, null, "Image not uploaded");
        } else {
          change_user_details(res, user, body, result);
        }
      }
    );
  } else {
    change_user_details(res, user, body);
  }
};

const fetch_user = async (req, res) => {
  const user = res.locals.user;

  successReq(res, user, "User fetched");
};

module.exports = { change_password, modify_user, fetch_user };
