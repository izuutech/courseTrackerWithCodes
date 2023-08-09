const successReq = (res, data, customMessage) => {
  res.status(200).json({
    message: customMessage ? customMessage : `Your request was successful`,
    error: null,
    data: data ? data : null,
  });
};

const createSuccess = (res, data, customMessage) => {
  res.status(201).json({
    message: customMessage ? customMessage : `Your request was successful`,
    error: null,
    data: data ? data : null,
  });
};

const serverError = (res, errorData, customMessage) => {
  res.status(500).json({
    message: null,
    error: customMessage ? customMessage : `An unknown error occured`,
    data: errorData ? errorData : null,
  });
};

const reqError = (res, errorData, customMessage) => {
  res.status(400).json({
    message: null,
    error: customMessage ? customMessage : `Invalid request!`,
    data: errorData ? errorData : null,
  });
};

const authError = (res, errorData, customMessage) => {
  res.status(401).json({
    message: null,
    error: customMessage ? customMessage : `Authentication failed!`,
    data: errorData ? errorData : null,
  });
};

const forbidError = (res, errorData, customMessage) => {
  res.status(403).json({
    message: null,
    error: customMessage ? customMessage : `Restricted content!`,
    data: errorData ? errorData : null,
  });
};

const notFound = (res, data, customMessage) => {
  res.status(404).json({
    message: customMessage
      ? customMessage
      : `Your request was successful but no data was returned`,
    error: null,
    data: data ? data : null,
  });
};

module.exports = {
  successReq,
  createSuccess,
  serverError,
  reqError,
  authError,
  forbidError,
  notFound,
};
