const fetch = require("cross-fetch");
const test = require("ava");
const { userA, userB } = require("../fixtures");
const { before, after, beforeEach } = require("../helpers");

test.serial.before(before);
test.serial.after(after);
test.serial.beforeEach(beforeEach);

test.serial("[GET /] returns all users as array", async (t) => {
  await t.context.collection.insertMany([{ ...userA }, { ...userB }]);
  const res = await fetch(t.context.url);
  const users = await res.json();
  t.true(Array.isArray(users) && users.length == 2);
});

test.serial(
  "[GET /] returns empty array when no users available",
  async (t) => {
    const res = await fetch(t.context.url);
    const users = await res.json();
    t.is(res.status, 200);
    t.true(Array.isArray(users) && !users.length);
  }
);

test.serial(
  "[GET /] returns users as objects without email attribute",
  async (t) => {
    await t.context.collection.insertOne({ ...userA });
    const res = await fetch(t.context.url);
    t.is(res.status, 200);
    const users = await res.json();
    t.true(users[0].email === userA.email && users[0].password === undefined);
  }
);

test.serial(
  "[GET /:id] returns single user as objects without email attribute",
  async (t) => {
    const { insertedId: userId } = await t.context.collection.insertOne({
      ...userA
    });
    const res = await fetch(`${t.context.url}/${userId}`);
    t.is(res.status, 200);
    const user = await res.json();
    t.true(user.email === userA.email && user.password === undefined);
  }
);

test.serial(
  "[GET /:id] returns 404 if user with given id doesn't exist",
  async (t) => {
    const res = await fetch(`${t.context.url}/123`);
    t.is(res.status, 404);
  }
);
