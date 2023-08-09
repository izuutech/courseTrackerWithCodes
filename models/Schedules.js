const mongoose = require("mongoose");
const Joi = require("joi");

const schema = mongoose.Schema;

const scheduleSchema = schema(
  {
    day: {
      type: String,
      required: [true, "Please enter the day of the weeks"], //"Monday",etc
    },
    startHour: {
      type: Number,
      required: [true, "Please enter the start hour"],
    },
    startMinute: {
      type: Number,
      required: [true, "Please enter the start minute"],
    },
    endHour: {
      type: Number,
      required: [true, "Please enter the end hour"],
    },
    endMinute: {
      type: Number,
      required: [true, "Please enter the end minute"],
    },
  },
  { timestamps: true }
);

const eachSchedule = Joi.object({
  day: Joi.string()
    .valid(
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    )
    .required()
    .label("Start day"),
  startHour: Joi.number().required().min(0).max(23).label("Start Hour"),
  startMinute: Joi.number().required().min(0).max(59).label("Start Minute"),
  endHour: Joi.number().required().min(0).max(23).label("End Hour"),
  endMinute: Joi.number().required().min(0).max(59).label("End Minute"),
});

const validateSchedule = (schedules) => {
  const schema = Joi.array().items(eachSchedule).label("Schedules");

  return schema.validate(schedules);
};
const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = { Schedule, validateSchedule };
