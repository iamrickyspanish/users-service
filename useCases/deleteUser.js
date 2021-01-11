const User = require("../models/user");
const notFoundError = require("../errors/notFound");

module.exports = async (_id) => {
  const user = await User.findOneAndDelete({ _id });
  if (!user) throw notFoundError;
  return user;
};
