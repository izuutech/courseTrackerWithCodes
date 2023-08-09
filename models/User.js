const mongoose = require("mongoose");
const Joi = require("joi");

const schema = mongoose.Schema;

const userSchema = schema(
  {
    regNoOrCode: {
      type: String,
      required: [true, "Please enter your lecturer code or student reg number"],
      unique: [true, "Registration number already exists"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: [true, "Email already exists"],
    },
    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    department: {
      type: String,
      required: [true, "Please enter your department"],
    },
    role: {
      type: String,
      required: [true, "Please enter user role"],
    },
    avatar: {
      type: String, //url
    },
  },
  { timestamps: true }
);

const validateUser = (person) => {
  const schema = Joi.object({
    regNoOrCode: Joi.string().required().label("Registration number"),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .min(5)
      .max(500)
      .required()
      .label("Email"),
    firstName: Joi.string().min(2).required().label("First name"),
    lastName: Joi.string().min(2).required().label("Last name"),
    department: Joi.string().required().label("Department"),
    role: Joi.string().valid("student", "lecturer").required().label("Role"),
    avatar: Joi.string().label("Avatar"),
    password: Joi.string().min(8).required().label("Password"),
  });

  return schema.validate(person);
};

const User = mongoose.model("User", userSchema);

module.exports = { User, validateUser };
