const User = require("../models/user");
const notFoundError = require("../errors/notFound");

module.exports = async (_id, data = {}) => {
  const user = await User.findOneAndUpdate({ _id }, data, { new: true });
  if (!user) throw notFoundError;
  return user;
};
