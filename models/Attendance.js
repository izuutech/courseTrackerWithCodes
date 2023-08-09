const mongoose = require("mongoose");

const schema = mongoose.Schema;

const courseSchema = schema(
  {
    uniqueId: {
      type: schema.Types.ObjectId,
      required: [true, "Please enter id to be encoded in barcorde"],
    },
    course: {
      type: schema.Types.ObjectId,
      required: [true, "Please enter course id"],
      ref: "Course",
    },
    lecturer: {
      type: schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please enter the id of the lecturer"],
    },
    attendies: [
      {
        type: schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
