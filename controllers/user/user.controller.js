const bcrypt = require("bcrypt");
const { User } = require("../../models/User");
const handlePromise = require("../../utils/handlePromise.utils");
const { serverError, successReq } = require("../../utils/responses.utils");

const change_password = async (req, res) => {
  const body = req.body;
  const [user, userErr] = await handlePromise(
    User.findById(res.locals.user._id)
  );
  if (user) {
    bcrypt.compare(body.password, user.password, async function (err, result) {
      if (result == true) {
        bcrypt.hash(body.newPassword, 10, async (hashErr, hash) => {
          if (hashErr) {
            serverError(res, null, "Something went wrong");
          } else {
            cosnt[(updateUser, updateUserErr)] = await handlePromise(
              User.findByIdAndUpdate(
                user._id,
                { password: hash },
                { returnDocument: "after" }
              )
            );
            if (updateUser) {
              successReq(res, null, "Password changed successfully");
            } else {
              serverError(res, updateUserErr, "Could not update your password");
            }
          }
        });
      } else {
        reqError(res, err, "Old password is incorrect");
      }
    });
  } else {
    serverError(res, null, "Cannot fetch your data");
  }
};

const modify_user = (async = async (req, res) => {
  const body = req.body;
  const user = res.locals.user;
  const avatar = req?.file?.avatar;
  cosnt[(updateUser, updateUserErr)] = await handlePromise(
    User.findByIdAndUpdate(
      user._id,
      {
        avatar: user.password,
        firstName: body.firstName,
        lastName: body.lastName,
      },
      { returnDocument: "after" }
    )
  );
  if (updateUser) {
    successReq(res, null, "Profile updated successfully");
  } else {
    serverError(res, updateUserErr, "Could not update your data");
  }
});

module.exports = { change_password, modify_user };
