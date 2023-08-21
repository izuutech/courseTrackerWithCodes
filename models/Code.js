const mongoose = require("mongoose");

const schema = mongoose.Schema;

const codeSchema = schema(
  {
    code: {
      type: String,
      required: [true, "Please enter unique code for the attendance"],
    },
    attendance: {
      type: schema.Types.ObjectId,
      required: [true, "Please enter attendance id"],
      ref: "Attendance",
    },
    used: {
      type: Boolean,
      required: [true, "Please enter status of the code"],
    },
  },
  { timestamps: true }
);

const Code = mongoose.model("Code", codeSchema);

module.exports = Code;
