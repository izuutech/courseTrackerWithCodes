const bcrypt = require("bcrypt");
const { validateUser, User } = require("../models/User");
const handlePromise = require("../utils/handlePromise.utils");
const {
  reqError,
  serverError,
  successReq,
} = require("../utils/responses.utils");

const register_student = async (req, res) => {
  const body = req.body;
  const file = req.file;
  const incomingUser = {
    regNoOrCode: body.regNoOrCode?.trim(),
    email: body.email?.toLowerCase()?.trim(),
    firstName: body.firstName?.trim(),
    lastName: body.lastName?.trim(),
    password: body.password?.trim(),
    department: body.department?.trim(),
    verified: false,
    // avatar: file.avatar,
    role: body.role,
  };
  const validateStatus = validateUser(incomingUser);
  if (validateStatus.error) {
    const theError = validateStatus.error.details[0];
    if (theError.context.key === "regNoOrCode") {
      const errMsg =
        incomingUser.role === "lecturer"
          ? theError.message.replace("Registration number", "Lecturer code")
          : theError.message;
      reqError(res, null, `${errMsg}`);
    } else {
      reqError(res, null, `${validateStatus.error.details[0].message}`);
    }
  } else {
    const [oldUser, oldUserErr] = await handlePromise(
      User.findOne({ email: incomingUser.email })
    );
    if (oldUser) {
      reqError(res, null, "User with that email already exists.");
    } else {
      bcrypt.hash(incomingUser.password, 10, async (hashErr, hash) => {
        if (!hashErr) {
          const user = new User({ ...incomingUser, password: hash });
          const [saved, savedErr] = await handlePromise(user.save());
          if (saved) {
            successReq(res, saved, "Registration successful. Please login");
          } else {
            serverError(res, savedErr, "Could not register user");
          }
        } else {
          serverError(res, hashErr, "Could not encrypt your password");
        }
      });
    }
  }
};

module.exports = {
  register_student,
};
