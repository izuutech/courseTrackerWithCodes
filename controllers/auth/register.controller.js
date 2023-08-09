const bcrypt = require("bcrypt");
const { validateUser, User } = require("../../models/User");
const handlePromise = require("../../utils/handlePromise.utils");
const {
  reqError,
  serverError,
  successReq,
} = require("../../utils/responses.utils");

const register_student = async (req, res) => {
  const body = req.body;
  const file = req.file;
  const random = Math.floor(Math.random() * 10000).toString();
  const code =
    random.length < 4
      ? `${random}8`
      : random.length > 4
      ? random.substring(1)
      : random;
  const incomingUser = {
    regNoOrCode: body.regNoOrCode?.trim(),
    email: body.email?.toLowerCase()?.trim(),
    firstName: body.firstName?.trim(),
    lastName: body.lastName?.trim(),
    password: body.password?.trim(),
    department: body.department?.trim(),
    verified: false,
    verificationCode: code,
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
      if (oldUser.verified === false) {
        const emailDetails = {
          verificationCode: code,
          from: "futofyp@gmail.com",
          to: saved.email,
          firstname: saved.firstname,
          subject: "Verify your email",
        };
        const sent = await gmailsendEmailConfirmation(emailDetails);
      }

      reqError(res, null, "User with that email already exists.");
    } else {
      bcrypt.hash(incomingUser.password, 10, async (hashErr, hash) => {
        if (!hashErr) {
          const user = new User({ ...incomingUser, password: hash });
          const [saved, savedErr] = await handlePromise(user.save());
          if (saved) {
            const emailDetails = {
              verificationCode: code,
              from: "futofyp@gmail.com",
              to: saved.email,
              firstname: saved.firstname,
              subject: "Verify your email",
            };

            const sent = await gmailsendEmailConfirmation(emailDetails);
            successReq(
              res,
              saved,
              "Registration successful. Please verify your email"
            );
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

const verify_user = async (req, res) => {
  const code = req.body.code;
  const email = req.body.email;
  const [oldUser, oldUserErr] = await handlePromise(User.findOne({ email }));
  if (oldUser && oldUser.verified === false) {
    if (oldUser.verificationCode === code) {
      const [verified, verifiedErr] = await handlePromise(
        User.findByIdAndUpdate(
          oldUser._id,
          { verified: true },
          { returnDocument: "after" }
        )
      );
      if (verified) {
        successReq(res, null, "User verified");
      } else {
        reqError(res, null, "User could not be verified");
      }
    } else {
      reqError(res, null, "Verification code does not match");
    }
  } else if (oldUser && oldUser.verified) {
    reqError(res, null, "Email already verified");
  } else {
    reqError(res, oldUserErr, "User could not be fetched");
  }
};

module.exports = {
  register_student,
  verify_user,
};
