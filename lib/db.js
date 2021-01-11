const mongoose = require("mongoose");

mongoose.connect("mongodb://root:root@db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

mongoose.connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

module.exports = mongoose.connection;
