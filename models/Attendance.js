const mongoose = require("mongoose");

const schema = mongoose.Schema;

const attendanceSchema = schema(
  {
    uniqueId: {
      type: String,
      required: [true, "Please enter id to be encoded in barcorde"],
      uniqueId: [true, "Unique id must be unique"],
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
    attendees: [
      {
        type: schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
