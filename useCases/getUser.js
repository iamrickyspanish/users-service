const User = require("../models/user");

module.exports = async (id) => {
  return await User.findById(id);
};
