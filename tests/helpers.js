const { client } = require("./fixtures");
const micro = require("micro");
const listen = require("test-listen");
const handler = require("../index");
const fetch = require("cross-fetch");
const DB_NAME = "users-test";
const COLLECTION_NAME = "users";

const before = async (t) => {
  t.context = {};
  t.context.service = micro(handler);
  await client.connect();
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);
  t.context.collection = collection;
  t.context.url = await listen(t.context.service);
  await (async () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  })();
};

const after = (t) => {
  t.context.service.close();
};

const beforeEach = async (t) => {
  await t.context.collection.deleteMany();
};

const login = async (url, credentials) =>
  fetch(`${url}/auth`, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json"
    }
  });

const create = async (url, data) => {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
  return res;
};

module.exports = {
  beforeEach,
  before,
  after,
  login,
  create
};
