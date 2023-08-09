const mongoose = require("mongoose");

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
    level: {
      type: String,
      required: [true, "Please enter the level of the course"],
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
