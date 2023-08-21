const uuid = require("uuid");
const { Course } = require("../../models/Course");
const handlePromise = require("../../utils/handlePromise.utils");
const {
  reqError,
  serverError,
  createSuccess,
  successReq,
  notFound,
} = require("../../utils/responses.utils");
const Attendance = require("../../models/Attendance");
const Code = require("../../models/Code");

const markAttendance = async (req, res) => {
  const user = res.locals.user;
  const body = req.body;
  const attendanceId = req.params.attendanceId;
  const [code, codeErr] = await handlePromise(
    Code.findOne({ attendance: attendanceId, code: body.code })
  );
  if (code && code.status === false) {
    const [attendance, attendanceErr] = await handlePromise(
      Attendance.findById(code.attendance).populate("course")
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
              const [updateCode, updateCodeErr] = await handlePromise(
                Code.findByIdAndUpdate(
                  code._id,
                  { used: true },
                  { returnDocument: "after" }
                )
              );
              if (updateCode) {
                successReq(res, null, "Your attendance has been marked");
              } else {
                successReq(
                  res,
                  null,
                  "Your attendance has been marked but code was not ticked as used"
                );
              }
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
  } else if (code && code.status) {
    forbidError(res, null, "Code has been used already");
  } else {
    reqError(res, codeErr, "Could not fetch code for that attendance");
  }
};

const generateUniqueCodes = (count) => {
  const generatedCodes = new Set();
  const codes = [];

  while (generatedCodes.size < count) {
    const code = Math.floor(Math.random() * 900000) + 100000; // Generate 6-digit random number
    generatedCodes.add(code);
  }

  generatedCodes.forEach((code) => {
    codes.push(code);
  });

  return codes;
};

const create_attendance = async (req, res) => {
  const lecturer = res.locals.user;
  const courseId = req.params.courseId;
  const uniqueId = uuid.v4();
  const numOfCodes = req.body.numOfCodes;
  const allCodes = generateUniqueCodes(numOfCodes);

  const [course, courseErr] = await handlePromise(
    Course.findById(courseId).populate("schedules")
  );
  if (course) {
    const allDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todaysDate = new Date();
    const todaysDay = allDays[todaysDate.getDay()];
    const scheduleDays = course.schedules.map((schedule, index) => {
      return allDays.indexOf(schedule.day);
    });
    const sortSchedule = scheduleDays.sort((a, b) => a - b);
    let nextDay;
    for (let x = 0; x < sortSchedule.length; x++) {
      if (todaysDay < sortSchedule[x]) {
        nextDay = sortSchedule[x];
        break;
      } else {
        nextDay = sortSchedule[0];
      }
    }

    const nextDayName = allDays[nextDay];
    const theNextSchedule = course.schedules.filter((schedule) => {
      return nextDayName === schedule.day;
    });

    if (theNextSchedule[0]) {
      const incoming = {
        numOfCodes,
        course: course._id,
        lecturer: lecturer._id,
        schedule: theNextSchedule[0],
      };
      const attendance = new Attendance(incoming);
      const [saved, savedErr] = await handlePromise(attendance.save());
      if (saved) {
        const [savedCodes, savedCodesErr] = await handlePromise(
          Code.insertMany(allCodes)
        );
        if (savedCodes) {
          createSuccess(
            res,
            { uniqueCodes: savedCodes },
            "Attendance generated"
          );
        } else {
          serverError(
            res,
            savedCodesErr,
            "Your unique codes could not be saved but attendance was created"
          );
        }
      } else {
        serverError(res, null, "Could not save attendance");
      }
    } else {
      reqError(res, null, "Please create a schedule before adding attendance");
    }
  } else {
    serverError(res, courseErr, "Could not fetch the course");
  }
};

const fetch_all_attendance_for_single_course = async (req, res) => {
  const courseId = req.params.courseId;
  const user = res.locals.user;
  const [attendances, attendancesErr] = await handlePromise(
    Attendance.find({ course: courseId }).populate("course")
  );
  if (attendances && attendances[0]) {
    if (user.role === "lecturer") {
      successReq(res, attendances, "All attendance fetched");
    } else {
      const allAttendance = attendances.map((attendance) => {
        const isPresent = attendance._doc.attendees.filter((student) => {
          return student.toString() === user._id.toString();
        });
        return {
          ...attendance._doc,
          present: isPresent[0] ? true : false,
        };
      });
      successReq(res, allAttendance, "All attendance fetched");
    }
  } else if (attendances && !attendances[0]) {
    notFound(res, [], "No attendance yet");
  } else {
    reqError(
      res,
      attendancesErr,
      "Could not fetch all attendance list for this course"
    );
  }
};

const fetch_single_attendance = async (req, res) => {
  const attendanceId = req.params.attendanceId;
  const [attendance, attendanceErr] = await handlePromise(
    Attendance.findById(attendanceId)
      .populate("course")
      .populate("attendees")
      .populate("schedule")
  );
  if (attendance) {
    successReq(res, attendance, "Attendance fetched");
  } else {
    reqError(
      res,
      attendanceErr,
      "Could not fetch attendance list for this course"
    );
  }
};

function removeDuplicatesFromArray(array) {
  const uniqueValues = [];
  const seenValues = new Set();

  for (const value of array) {
    const stringValue = value.toString(); // Convert ObjectId to string
    if (!seenValues.has(stringValue)) {
      uniqueValues.push(value);
      seenValues.add(stringValue);
    }
  }

  return uniqueValues;
}

const add_student_to_attendance = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  if (body.studentIds && Array.isArray(body.studentIds)) {
    const [attendance, attendanceErr] = await handlePromise(
      Attendance.findById(id).populate("course")
    );
    if (attendance) {
      const newAttendance = removeDuplicatesFromArray([
        ...attendance.attendees,
        body.studentIds,
      ]);
      const [updateAttendance, updateAttendanceErr] = await handlePromise(
        Attendance.findByIdAndUpdate(
          attendance._id,
          { $set: { attendees: newAttendance } },
          { returnDocument: "after" }
        )
      );
      if (updateAttendance) {
        successReq(
          res,
          updateAttendance,
          "Successfully added to the attendance list"
        );
      } else {
        serverError(res, updateAttendanceErr, "Could not update attendance");
      }
    } else {
      serverError(res, attendanceErr, "Cannot fetch attendance");
    }
  } else {
    reqError(res, null, "Student ids is required");
  }
};

module.exports = {
  markAttendance,
  create_attendance,
  fetch_all_attendance_for_single_course,
  fetch_single_attendance,
  add_student_to_attendance,
};
