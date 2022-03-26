const test = require("ava");
const { userA, userB } = require("../fixtures");
const { before, after, beforeEach, update } = require("../helpers");

test.after(after);
test.before(before);
test.serial.beforeEach(beforeEach);

test.serial(
  "[PATCH /:id] returns 200 and updated user without password",
  async (t) => {
    const { insertedId: userId } = await t.context.collection.insertOne({
      ...userA
    });
    const res = await update(t.context.url, userId, userB);
    t.is(res.status, 200);
    const user = await res.json();
    t.true(user.email === userB.email && user.password === undefined);
    const userFromDB = await t.context.collection.findOne({ _id: userId });
    t.is(userFromDB.email, userB.email);
    t.not(userFromDB.password, userA.password);
  }
);

test.serial("[PATCH /:id] returns 404 if user does not exist", async (t) => {
  const res = await update(t.context.url, 12345, userB);
  t.is(res.status, 404);
});
