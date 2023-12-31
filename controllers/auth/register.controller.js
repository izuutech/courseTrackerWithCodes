const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const { validateUser, User } = require("../../models/User");
const handlePromise = require("../../utils/handlePromise.utils");
const {
  reqError,
  serverError,
  successReq,
  unprocessReq,
} = require("../../utils/responses.utils");
const { gmailsendEmailConfirmation } = require("./email.controller");

cloudinary.config({
  cloud_name: "dyx2e9ox4",
  api_key: "348882827666355",
  api_secret: "Q-wYSL5K2j0J3bLWGMgU5mTzTuE",
});

const create_user = async (res, theUser, code) => {
  const user = new User(theUser);
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
    successReq(res, saved, "Registration successful. Please verify your email");
  } else {
    serverError(res, savedErr, "Could not register user");
  }
};

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
          to: oldUser.email,
          firstname: oldUser.firstname,
          subject: "Verify your email",
        };
        const sent = await gmailsendEmailConfirmation(emailDetails);
        unprocessReq(
          res,
          null,
          "User already registered. Please check your email for verification code"
        );
      } else {
        reqError(res, null, "User with that email already exists.");
      }
    } else {
      const [oldRegNo, oldRegNoErr] = await handlePromise(
        User.findOne({ regNoOrCode: incomingUser.regNoOrCode })
      );
      if (oldRegNo) {
        reqError(
          res,
          null,
          `${
            incomingUser.role === "lecturer"
              ? "Lecturer code"
              : "Registration number"
          } already exists`
        );
      } else {
        bcrypt.hash(incomingUser.password, 10, async (hashErr, hash) => {
          if (!hashErr) {
            if (req.file && req.file.path) {
              cloudinary.v2.uploader.upload(
                req.file.path,
                { public_id: req.file.originalname },
                async function (error, result) {
                  if (error) {
                    serverError(res, null, "Could not upload image");
                  } else {
                    const theUser = {
                      ...incomingUser,
                      password: hash,
                      avatar: result.secure_url,
                    };
                    create_user(res, theUser, code);
                  }
                }
              );
            } else {
              const theUser = {
                ...incomingUser,
                password: hash,
              };
              create_user(res, theUser, code);
            }
          } else {
            serverError(res, hashErr, "Could not encrypt your password");
          }
        });
      }
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
      reqError(res, null, "Verification code is incorrect");
    }
  } else if (oldUser && oldUser.verified) {
    reqError(res, null, "Email already verified");
  } else {
    reqError(res, oldUserErr, "User could not be fetched");
  }
};

const resend_email = async (req, res) => {
  const body = req.body;
  const random = Math.floor(Math.random() * 10000).toString();
  const code =
    random.length < 4
      ? `${random}8`
      : random.length > 4
      ? random.substring(1)
      : random;
  const [oldUser, oldUserErr] = await handlePromise(
    User.findOne({ email: body.email })
  );
  if (oldUser) {
    const [updateUser, updateUserErr] = await handlePromise(
      User.findByIdAndUpdate(
        oldUser._id,
        { verificationCode: code },
        { returnDocument: "after" }
      )
    );
    if (updateUser) {
      const emailDetails = {
        verificationCode: updateUser.verificationCode,
        from: "futofyp@gmail.com",
        to: oldUser.email,
        firstname: oldUser.firstname,
        subject: "Verify your email",
      };

      const sent = await gmailsendEmailConfirmation(emailDetails);

      successReq(
        res,
        null,
        "Email resent. Please check your spam or promotion folder if it is not in your inbox"
      );
    } else {
      reqError(res, updateUserErr, "Could not resend email");
    }
  } else {
    reqError(res, oldUserErr, "Email has not been registered");
  }
};

module.exports = {
  register_student,
  verify_user,
  resend_email,
};
