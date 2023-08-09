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

const markAttendance = async (req, res) => {
  const user = res.locals.user;
  const barcodeId = req.params.barcodeId;
  const [attendance, attendanceErr] = await handlePromise(
    Attendance.findOne({ uniqueId: barcodeId }).populate("course")
  );
  if (attendance) {
    const [course, courseErr] = await handlePromise(
      Course.findById(attendance.course)
    );
    if (course) {
      const haveRegisteredForTheCourse = course.students.filter((student) => {
        return student.toString() === user._id.toString();
      });
      if (haveRegisteredForTheCourse[0]) {
        const haveAttended = attendance.attendees.filter((attendee) => {
          return attendee.toString() === user._id.toString();
        });
        if (haveAttended[0]) {
          reqError(
            res,
            null,
            "You have already marked attendance for this course."
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
        reqError(
          res,
          null,
          "You must register for this course to mark attendance"
        );
      }
    } else {
      serverError(res, null, "Could not fetch course");
    }
  } else {
    serverError(res, null, "Could not fetch attendance");
  }
};

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

const fetch_all_attendance_for_single_course = async (req, res) => {
  const courseId = req.params.courseId;
  const [attendances, attendancesErr] = await handlePromise(
    Attendance.find({ course: courseId }).populate("course")
  );
  if (attendances) {
    successReq(res, attendances, "All attendance fetched");
  } else {
    serverError(
      res,
      attendancesErr,
      "Could not fetch all attendance lsit for this course"
    );
  }
};

module.exports = {
  markAttendance,
  create_attendance,
  fetch_all_attendance_for_single_course,
};
