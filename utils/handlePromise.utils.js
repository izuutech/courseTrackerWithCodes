const handlePromise = async (suppliedPromise) => {
  try {
    const data = await suppliedPromise;
    return [data, null];
  } catch (e) {
    return [null, e];
  }
};

module.exports = handlePromise;
