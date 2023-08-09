const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { authError } = require("../utils/responses.utils");
const handlePromise = require("../utils/handlePromise.utils");

const requireAuth = (req, res, next) => {
  // const token = req.cookies.jwt;
  const bearer = req.headers.authorization;
  const bearerToken = bearer?.split(" ");
  const token = bearerToken ? bearerToken[1] : "invalid";
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
      if (err) {
        authError(res, err, "Invalid token");
      } else {
        let [person, personErr] = await handlePromise(
          User.findById(decodedToken.id)
        );
        if (person && person.verified === true) {
          res.locals.user = {
            _id: person._id,
            email: person.email,
            lastName: person.lastName,
            firstName: person.firstName,
            department: person.department,
            regNoOrCode: person.regNoOrCode,
            role: person.role,
          };

          next();
        } else if (person && person.verified === false) {
          authError(
            res,
            personErr,
            "You can't perform this action because you are not verified"
          );
        } else {
          authError(
            res,
            personErr,
            "Not authorized to access content. Please login"
          );
        }
      }
    });
  } else {
    authError(res, { url: "/login" }, "Please login");
  }
};

const requireLecturer = (req, res, next) => {
  // const token = req.cookies.admintoken;
  const bearer = req.headers.authorization;
  const bearerToken = bearer?.split(" ");
  const token = bearerToken ? bearerToken[1] : "invalid";

  if (token) {
    jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
      if (err) {
        authError(res, err, "Invalid token");
      } else {
        const [person, personErr] = await handlePromise(
          User.findById(decodedToken.id)
        );

        if (person && person.verified === true && person.role === "lecturer") {
          res.locals.user = {
            _id: person._id,
            email: person.email,
            lastName: person.lastName,
            firstName: person.firstName,
            department: person.department,
            regNoOrCode: person.regNoOrCode,
            role: person.role,
          };

          next();
        } else {
          authError(
            res,
            personErr,
            "Not authorized to access content. Please login"
          );
        }
      }
    });
  } else {
    authError(res, { url: "/login" }, "Please login");
  }
};

module.exports = { requireAuth, requireLecturer };
