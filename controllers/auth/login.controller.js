const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/User");
const handlePromise = require("../../utils/handlePromise.utils");
const { reqError, authError } = require("../../utils/responses.utils");

const createToken = async (id) => {
  return jwt.sign({ id: id }, process.env.JWT_KEY, {
    expiresIn: "3h",
  });
};

const login_user = async (req, res) => {
  const body = req.body;
  const [user, userErr] = await handlePromise(
    User.findOne({ email: body.email.toLowerCase() })
  );
  if (user) {
    bcrypt.compare(body.password, user.password, async function (err, result) {
      if (result == true) {
        //login function here
        const token = await createToken(user._id);
        const maxAge = 3 * 60 * 60; //3hrs
        if (user.verified === true) {
          if (user.role === "student") {
            res
              .status(200)
              .cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000,
              })
              .json({
                message: "Student logged in",
                error: null,
                data: {
                  role: user.role,
                  userToken: token,
                  email: user.email,
                  lastName: user.lastName,
                  firstName: user.firstName,
                  department: user.department,
                  regNoOrCode: user.regNoOrCode,
                  avatar: user.avatar,
                  _id: user._id,
                },
              });
          } else if (user.role === "lecturer") {
            res
              .status(200)
              .cookie("admintoken", token, {
                httpOnly: true,
                maxAge: maxAge * 1000,
              })
              .cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000,
              })
              .json({
                message: "Lecturer logged in",
                error: null,
                data: {
                  role: user.role,
                  userToken: token,
                  email: user.email,
                  lastName: user.lastName,
                  firstName: user.firstName,
                  department: user.department,
                  regNoOrCode: user.regNoOrCode,
                  avatar: user.avatar,
                  _id: user._id,
                },
              });
          }
        } else {
          authError(
            res,
            userErr,
            "You cannot login because you have not verified your email."
          );
        }
      } else {
        reqError(res, err, "Password is incorrect");
      }
    });
  } else {
    reqError(res, userErr, "Email does not exist");
  }
};

module.exports = { login_user };
