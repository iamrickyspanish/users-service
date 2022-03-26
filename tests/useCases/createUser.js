const test = require("ava");
const fetch = require("cross-fetch");
const { userA } = require("../fixtures");
const { before, after, beforeEach, create } = require("../helpers");

test.serial.before(before);
test.serial.after(after);
test.serial.beforeEach(beforeEach);

test.serial("[POST /] creates a new user", async (t) => {
  await create(t.context.url, userA);
  const res = await fetch(t.context.url);
  const [user] = await res.json();
  t.true(user.email === userA.email);
});

test.serial(
  "[POST /] user creation returns 201 and user object without password attribute",
  async (t) => {
    const res = await create(t.context.url, userA);
    t.is(res.status, 201);
    const user = await res.json();
    t.true(user.email === userA.email && user.password === undefined);
  }
);

test.serial(
  "[POST /] unique emil: should not create user with already existing email, returns 400",
  async (t) => {
    await t.context.collection.insertOne(userA);
    const res = await create(t.context.url, userA);
    t.is(res.status, 400);
  }
);
