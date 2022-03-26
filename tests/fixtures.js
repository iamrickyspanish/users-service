const { MongoClient } = require("mongodb");

const userA = Object.freeze({
  email: "a@mail.com",
  password: "secret123"
});

const userB = Object.freeze({
  email: "b@mail.com",
  password: "secret456"
});

const client = new MongoClient(process.env.TEST_DB_HOST);

module.exports = {
  userA,
  userB,
  client
};
