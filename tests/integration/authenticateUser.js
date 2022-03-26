const test = require("ava");
const { userA, userB } = require("../fixtures");
const { before, after, beforeEach, login, create } = require("../helpers");

test.serial.before(before);
test.serial.after(after);
test.serial.beforeEach(async (t) => {
  await beforeEach(t);
  await create(t.context.url, userA);
});

test.serial(
  "[POST /auth] successfull authentication returns status 200 and user data without password field",
  async (t) => {
    const res = await login(t.context.url, {
      email: userA.email,
      password: userA.password
    });
    t.is(res.status, 200);
    const user = await res.json();
    t.true(user.email === userA.email && user.password === undefined);
  }
);

test.serial(
  "[POST /auth] failed authentication because user does not exist: returns status 401",
  async (t) => {
    const res = await login(t.context.url, {
      email: userB.email,
      password: userB.password
    });
    t.is(res.status, 401);
  }
);

test.serial(
  "[POST /auth] failed authentication because password not valid: returns status 401",
  async (t) => {
    const res = await login(t.context.url, {
      email: userB.email,
      password: userB.password
    });
    t.is(res.status, 401);
  }
);
