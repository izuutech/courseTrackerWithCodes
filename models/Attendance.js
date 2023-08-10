const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

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
    schedule: {
      type: schema.Types.ObjectId,
      required: [true, "Please enter the schedules of the class"],
      ref: "Schedule",
    },
    attendees: [
      {
        type: schema.Types.ObjectId,
        ref: "User",
        validate: {
          validator: async function (value) {
            const duplicateCount = value.filter(
              (item, index) => value.indexOf(item) !== index
            ).length;
            return duplicateCount === 0;
          },

          message: "Duplicate attendees are not allowed",
        },
      },
    ],
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
