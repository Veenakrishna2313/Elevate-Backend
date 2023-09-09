authenicator = (req, res, next) => {
  console.log("Authenticating.......");
  next();
};

module.exports = authenicator;
