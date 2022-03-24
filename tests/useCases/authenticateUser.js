const test = require("ava");
const axios = require("axios");
const { userA, userB } = require("../fixtures");
const { before, after, beforeEach } = require("../helpers");

test.before(async (t) => {
  await before(t);
  await t.context.collection.insertOne(userA);
  t.context.url = `${t.context.url}/auth`;
});
test.after(after);
test.beforeEach(beforeEach);

test.serial("POST /auth authenticate user by email and password", async (t) => {
  await axios.post(t.context.url, {
    email: userA.email,
    password: userA.password
  });
  t.pass();
});

test.serial(
  "POST /auth successfull authentication returns status 200 and user data without password field",
  async (t) => {
    const { status, data: user } = await axios.post(t.context.url, {
      email: userA.email,
      password: userA.password
    });
    t.true(status === 200);
    t.true(user.email === userA.email && userA.password === undefined);
  }
);

test.serial("POST /auth returns error 401 on invalid login", async (t) => {
  const { response } = await t.throwsAsync(
    async () =>
      axios.post(t.context.url, {
        email: userA.email,
        password: userB.password
      })
    // { code: 401 }
  );
  t.is(response.status, 401);
});
