const User = require("../models/user");

module.exports = async (body = {}) => {
  return await User.find({});
};
