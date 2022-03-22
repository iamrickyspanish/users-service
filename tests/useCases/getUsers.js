const axios = require("axios");
const test = require("ava");
const { userA, userB } = require("../fixtures");
const { before, after } = require("../helpers");

test.before(before);
test.after(after);

test.beforeEach(async (t) => {
  await t.context.collection.deleteMany();
});

test.serial("GET / returns all users as array", async (t) => {
  await t.context.collection.insertMany([userA, userB]);
  const { data: users } = await axios.get(t.context.url);
  t.true(Array.isArray(users) && users.length == 2);
});

test.serial("GET / returns empty array when no users available", async (t) => {
  const { data: users } = await axios.get(t.context.url);
  t.true(Array.isArray(users) && !users.length);
});
