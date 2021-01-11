const User = require("../models/user");

module.exports = async (body = {}) => {
  const user = new User(body);
  return await user.save();
};
