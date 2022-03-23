const test = require("ava");
const axios = require("axios");
const { userA, userB } = require("../fixtures");
const { before, after } = require("../helpers");

test.before(before);
test.after(after);

test.beforeEach(async (t) => {
  await t.context.collection.deleteMany();
});

test.serial("POST / creates a new user", async (t) => {
  await axios.post(t.context.url, userA);
  const { data: users } = await axios.get(t.context.url);
  t.true(users[0].email === userA.email);
});

test.serial(
  "POST / user creation returns user object without password attribute",
  async (t) => {
    const { data: user } = await axios.post(t.context.url, userA);
    console.log("user", user);
    t.true(user.email === userA.email && user.password === undefined);
  }
);

test.serial(
  "POST / unique emil: should not create user with already existing email",
  async (t) => {
    await t.context.collection.insertOne(userA);
    try {
      await axios.post(t.context.url, userA);
      t.fail("created user with existing email without returning error");
    } catch (e) {
      t.pass();
    }
  }
);
