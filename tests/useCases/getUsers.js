const axios = require("axios");
const test = require("ava");
const { userA, userB } = require("../fixtures");
const { before, after, beforeEach } = require("../helpers");

test.before(before);
test.after(after);
test.beforeEach(beforeEach);

test.serial("GET / returns all users as array", async (t) => {
  await t.context.collection.insertMany([userA, userB]);
  const { data: users } = await axios.get(t.context.url);
  t.true(Array.isArray(users) && users.length == 2);
});

test.serial("GET / returns empty array when no users available", async (t) => {
  const { data: users } = await axios.get(t.context.url);
  t.true(Array.isArray(users) && !users.length);
});

test.serial(
  "GET / returns users as objects without email attribute",
  async (t) => {
    await t.context.collection.insertOne(userA);
    const { data: users } = await axios.get(t.context.url);
    t.true(users[0].email === userA.email && users[0].password === undefined);
  }
);
