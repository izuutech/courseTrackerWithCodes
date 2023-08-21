const Code = require("../../models/Code");
const handlePromise = require("../../utils/handlePromise.utils");
const { reqError, successReq } = require("../../utils/responses.utils");

const fetch_codes_for_attendance = async (req, res) => {
  const attendanceId = req.params.attendanceId;
  const [codes, codesErr] = await handlePromise(
    Code.find({ attendance: attendanceId })
  );
  if (codes) {
    successReq(res, codes, "Codes fetched");
  } else {
    reqError(res, null, "Could not fetch codes");
  }
};

module.exports = { fetch_codes_for_attendance };
