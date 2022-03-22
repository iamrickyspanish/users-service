const { MongoClient } = require("mongodb");

const userA = {
  email: "a@mail.com",
  password: "secret123"
};

const userB = {
  email: "b@mail.com",
  password: "secret123"
};

const client = new MongoClient(process.env.TEST_DB_HOST);

module.exports = {
  userA,
  userB,
  client
};
