function handleError(cb) {
  return (req, res, next) => {
    cb(req, res, next).catch((err) => {
      console.log(err);
      console.log(err.message);
      res.status(err.status || 500).json({ message: err.message });
    });
  };
}

module.exports = handleError;
