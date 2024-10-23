const mongoose = require("mongoose");

const attachUserToQuery = (req, res, next) => {
  // Attach the user to Mongoose query options if req.user exists
  if (req.user) {
    mongoose.Query.prototype.setOptions.call(this, { user: req.user });
  }
  next();
};

module.exports = attachUserToQuery;
