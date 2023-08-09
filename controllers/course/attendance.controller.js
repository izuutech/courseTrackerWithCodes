const uuid = require("uuid");
const { Course } = require("../../models/Course");
const handlePromise = require("../../utils/handlePromise.utils");
const {
  reqError,
  notFound,
  serverError,
  createSuccess,
  successReq,
} = require("../../utils/responses.utils");
const Attendance = require("../../models/Attendance");

const create_attendance = async (req, res) => {
  const lecturer = res.locals.user;
  const courseId = req.params.courseId;
  const uniqueId = uuid.v4();
  const [course, courseErr] = await handlePromise(Course.findById(courseId));
  if (course) {
    const incoming = {
      uniqueId,
      course: course._id,
      lecturer: lecturer._id,
    };
    const attendance = new Attendance(incoming);
    const [saved, savedErr] = await handlePromise(attendance.save());
    if (saved) {
      createSuccess(res, { barcodeId: saved.uniqueId }, "Attendance generated");
    } else {
      serverError(res, null, "Could not save attendance");
    }
  } else {
    serverError(res, courseErr, "Could not fetch the course");
  }
};

const markAttendance = async (req, res) => {
  const user = res.locals.user;
  const attendanceId = req.params.attendanceId;
  const [attendance, attendanceErr] = await handlePromise(
    Attendance.findById(attendanceId).populate("course")
  );
  if (attendance) {
    const haveAttended = attendance.attendees.map((attendee) => {
      return attendee === user._id;
    });
    if (haveAttended[0]) {
      reqError(
        res,
        null,
        "You have marked attendance for this course previously"
      );
    } else {
      const newAttendance = [...attendance.attendees, user._id];
      const [updateAttendance, updateAttendanceErr] = await handlePromise(
        Attendance.findByIdAndUpdate(
          attendance._id,
          { attendees: newAttendance },
          { returnDocument: "after" }
        )
      );
      if (updateAttendance) {
        successReq(res, null, "Your attendance has been marked");
      } else {
        serverError(res, null, "Could not update attendance");
      }
    }
  } else {
    serverError(res, null, "Could not fetch attendance");
  }
};

module.exports = { create_attendance, markAttendance };
