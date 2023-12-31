const mongoose = require("mongoose");
const Joi = require("joi");

const schema = mongoose.Schema;

const courseSchema = schema(
  {
    title: {
      type: String,
      required: [true, "Please enter course title"],
    },
    courseCode: {
      type: String,
      required: [true, "Please enter course code"],
      unique: [true, "Course code already exists"],
    },
    courseType: {
      type: String,
      required: [true, "Please enter course code"],
    },
    department: {
      type: String,
      required: [true, "Please enter department"],
    },
    description: {
      type: String,
    },
    level: {
      type: String,
      required: [true, "Please enter the level of the course"],
    },
    venue: {
      type: String,
      required: [true, "Please enter the venue"],
    },
    schedules: [
      {
        type: schema.Types.ObjectId,
        required: [true, "Please enter the schedules of the class"],
        ref: "Schedule",
      },
    ],
    lecturers: [
      {
        type: schema.Types.ObjectId,
        ref: "User",
      },
    ],
    students: [
      {
        type: schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const validateCourse = (course) => {
  const schema = Joi.object({
    title: Joi.string().required().label("Title"),
    courseCode: Joi.string().min(2).required().label("Course code"),
    courseType: Joi.string().min(2).required().label("Course type"),
    description: Joi.string().min(2).required().label("Description"),
    department: Joi.string().min(2).required().label("Department"),
    level: Joi.string().min(2).required().label("Level"),
    venue: Joi.string().required().label("Venue"),
    schedules: Joi.array().label("Schedules"),
    lecturers: Joi.array().label("Lecturers"),
    students: Joi.array().label("Students"),
  });

  return schema.validate(course);
};

const Course = mongoose.model("Course", courseSchema);

module.exports = { Course, validateCourse };
