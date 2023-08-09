const { Course, validateCourse } = require("../../models/Course");
const { validateSchedule, Schedule } = require("../../models/Schedules");
const handlePromise = require("../../utils/handlePromise.utils");
const {
  reqError,
  createSuccess,
  successReq,
} = require("../../utils/responses.utils");

const save_course = async (req, res, scheduleIds) => {
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

const create_course = async (req, res) => {
  const body = req.body;
  const suppliedSchedules = body.schedules;

  if (suppliedSchedules && suppliedSchedules[0]) {
    const validateSch = validateSchedule(suppliedSchedules);
    if (validateSch.error) {
      console.log(":meee", validateSch.error.details[0]);
      reqError(res, null, `${validateSch.error.details[0].message}`);
    } else {
      const [savedSchedules, savedSchedulesErr] = await handlePromise(
        Schedule.insertMany(suppliedSchedules)
      );
      if (savedSchedules) {
        console.log("savedSchedules", savedSchedules);
        const scheduleIds = savedSchedules
          ? savedSchedules.map((schedule) => {
              return schedule._id;
            })
          : [];
        save_course(req, res, scheduleIds);
      } else {
        reqError(res, savedSchedulesErr, "Could not save schedules");
      }
    }
  } else {
    save_course(req, res);
  }
};

const fetch_all_courses = async (req, res) => {
  const [courses, coursesErr] = await handlePromise(
    Course.find({}).populate("schedules", "lecturers").sort({ createdAt: -1 })
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
    Course.findById(req.params.id).populate("schedules", "lecturers")
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
      reqError(res, courseByCodeErr || courseErr, "Could not fetch course");
    }
  }
};

module.exports = { create_course, fetch_all_courses, fetch_single_courses };
