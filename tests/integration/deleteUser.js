const test = require("ava");
const { userA } = require("../fixtures");
const { before, after, beforeEach, destroy } = require("../helpers");

test.after(after);
test.before(before);
test.serial.beforeEach(beforeEach);

test.serial("[DELETE /:id] deletes user and returns 200", async (t) => {
  const { insertedId: userId } = await t.context.collection.insertOne({
    ...userA
  });
  const res = await destroy(t.context.url, userId);
  t.is(res.status, 200);
  const user = await t.context.collection.findOne({ _id: userId });
  t.is(!!user, false);
});

test.serial("[DELETE /:id] returns 404 if user soes not exist", async (t) => {
  const res = await destroy(t.context.url, 12345);
  t.is(res.status, 404);
});
