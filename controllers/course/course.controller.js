const { Course, validateCourse } = require("../../models/Course");
const { validateSchedule, Schedule } = require("../../models/Schedules");
const handlePromise = require("../../utils/handlePromise.utils");
const {
  reqError,
  createSuccess,
  successReq,
  serverError,
} = require("../../utils/responses.utils");

const save_created_course = async (req, res, scheduleIds) => {
  const body = req.body;
  const lecturer = res.locals.user;
  const data = {
    title: body.title,
    courseCode: body.courseCode,
    courseType: body.courseType,
    description: body.description,
    level: body.level,
    venue: body.venue,
    schedules: scheduleIds || [],
    lecturers: [lecturer._id],
    students: [],
  };

  const validateStatus = validateCourse(data);
  if (validateStatus.error) {
    reqError(res, null, `${validateStatus.error.details[0].message}`);
  } else {
    const [oldCourse, oldCourseErr] = await handlePromise(
      Course.findOne({ courseCode: data.courseCode })
    );
    if (oldCourse) {
      reqError(res, null, "Course code already exists");
    } else {
      const course = new Course(data);
      const [saved, savedErr] = await handlePromise(course.save());
      if (saved) {
        createSuccess(res, saved, "Course created");
      } else {
        reqError(res, savedErr, "Could not create course");
      }
    }
  }
};

const hasDuplicateValue = (array) => {
  const valueCount = {};

  for (const value of array) {
    if (valueCount[value]) {
      return true; // Value appeared twice, so return true
    } else {
      valueCount[value] = true; // Mark the value as seen
    }
  }

  return false; // No value appeared twice
};

const create_course = async (req, res) => {
  const body = req.body;
  const suppliedSchedules = body.schedules;
  if (
    suppliedSchedules &&
    Array.isArray(suppliedSchedules) &&
    suppliedSchedules[0]
  ) {
    const days = suppliedSchedules.map((s) => {
      return s.day;
    });
    if (hasDuplicateValue(days)) {
      reqError(res, null, "You cannot teach a course twice in a day");
    } else {
      const validateSch = validateSchedule(suppliedSchedules);
      if (validateSch.error) {
        console.log(":meee", validateSch.error.details[0]);
        reqError(res, null, `${validateSch.error.details[0].message}`);
      } else {
        const [savedSchedules, savedSchedulesErr] = await handlePromise(
          Schedule.insertMany(suppliedSchedules)
        );
        if (savedSchedules) {
          const scheduleIds = savedSchedules
            ? savedSchedules.map((schedule) => {
                return schedule._id;
              })
            : [];
          save_created_course(req, res, scheduleIds);
        } else {
          reqError(res, savedSchedulesErr, "Could not save schedules");
        }
      }
    }
  } else {
    save_created_course(req, res);
  }
};

const fetch_all_courses = async (req, res) => {
  const [courses, coursesErr] = await handlePromise(
    Course.find({})
      .populate("schedules")
      .populate("lecturers")
      .populate("students")
      .sort({ createdAt: -1 })
  );
  if (courses && courses[0]) {
    successReq(res, courses, "Courses fetched");
  } else if (courses) {
    successReq(res, null, "No course yet");
  } else {
    reqError(res, coursesErr, "Could not fetch courses");
  }
};

const fetch_single_courses = async (req, res) => {
  const [course, courseErr] = await handlePromise(
    Course.findById(req.params.id)
      .populate("schedules")
      .populate("lecturers")
      .populate("students")
  );
  if (course) {
    successReq(res, course, "Course fetched");
  } else {
    const [courseByCode, courseByCodeErr] = await handlePromise(
      Course.findOne({ courseCode: req.params.id })
    );
    if (courseByCode) {
      successReq(res, courseByCode, "Course fetched");
    } else {
      serverError(res, courseByCodeErr || courseErr, "Could not fetch course");
    }
  }
};

const save_student_courses = async (res, course, newStudents, operation) => {
  const [add, addErr] = await handlePromise(
    Course.findByIdAndUpdate(
      course._id,
      { students: newStudents },
      { returnDocument: "after" }
    )
  );
  if (add) {
    successReq(
      res,
      null,
      `Successfully ${operation === "add" ? "added" : "removed"} ${
        course.title
      } ${operation === "add" ? "to" : "from"} your list of courses`
    );
  } else {
    serverError(res, addErr, "Could not save to the list of your courses");
  }
};

const toggele_add_course_to_courses_for_student = async (req, res) => {
  const user = res.locals.user;
  const [course, courseErr] = await handlePromise(
    Course.findById(req.params.id)
  );
  if (course) {
    const haveAdded = course.students.filter((student) => {
      return student.toString() === user._id.toString();
    });
    if (haveAdded && haveAdded[0]) {
      const newStudents = course.students.filter((student) => {
        return student.toString() !== user._id.toString();
      });
      save_student_courses(res, course, newStudents, "remove");
    } else {
      const newStudents = [...course.students, user._id];
      save_student_courses(res, course, newStudents, "add");
    }
  } else {
    serverError(res, courseErr, "Could not fetch course");
  }
};

const save_lecturer_courses = async (res, course, newLecturers, operation) => {
  const [add, addErr] = await handlePromise(
    Course.findByIdAndUpdate(
      course._id,
      { lecturers: newLecturers },
      { returnDocument: "after" }
    )
  );
  if (add) {
    successReq(
      res,
      null,
      `Successfully ${operation === "add" ? "added" : "removed"} ${
        course.title
      } ${operation === "add" ? "to" : "from"} your list of courses`
    );
  } else {
    serverError(res, addErr, "Could not save to the list of your courses");
  }
};

const toggele_add_course_to_courses_for_lecturers = async (req, res) => {
  const user = res.locals.user;
  const [course, courseErr] = await handlePromise(
    Course.findById(req.params.id)
  );
  if (course) {
    const haveAdded = course.lecturers.filter((lecturer) => {
      return lecturer.toString() === user._id.toString();
    });
    if (haveAdded && haveAdded[0]) {
      const newLecturers = course.lecturers.filter((lecturer) => {
        return lecturer.toString() !== user._id.toString();
      });
      save_lecturer_courses(res, course, newLecturers, "remove");
    } else {
      const newLecturers = [...course.lecturers, user._id];
      save_lecturer_courses(res, course, newLecturers, "add");
    }
  } else {
    serverError(res, courseErr, "Could not fetch course");
  }
};

module.exports = {
  create_course,
  fetch_all_courses,
  fetch_single_courses,
  toggele_add_course_to_courses_for_student,
  toggele_add_course_to_courses_for_lecturers,
};
