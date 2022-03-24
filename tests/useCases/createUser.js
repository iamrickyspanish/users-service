const test = require("ava");
const axios = require("axios");
const { userA } = require("../fixtures");
const { before, after, beforeEach } = require("../helpers");

test.before(before);
test.after(after);
test.beforeEach(beforeEach);

test.serial("POST / creates a new user", async (t) => {
  await axios.post(t.context.url, userA);
  const { data: users } = await axios.get(t.context.url);
  t.true(users[0].email === userA.email);
});

test.serial(
  "POST / user creation returns 201 and user object without password attribute",
  async (t) => {
    const { status, data: user } = await axios.post(t.context.url, userA);
    t.is(status, 201);
    t.true(user.email === userA.email && user.password === undefined);
  }
);

test.serial(
  "POST / unique emil: should not create user with already existing email",
  async (t) => {
    await t.context.collection.insertOne(userA);
    await t.throwsAsync(async () => axios.post(t.context.url, userA));
  }
);
