const { client } = require("./fixtures");
const micro = require("micro");
const listen = require("test-listen");
const handler = require("../index");

const DB_NAME = "users-test";
const COLLECTION_NAME = "users";

// const preTest = async () => {
//   await client.connect();
//   const collections = await client.db().listCollections().toArray();
//   const exists = !!collections.find((c) => c.name === COLLECTION_NAME);
//   if (exists)
//     for (let collection of collections) {
//       await collection.deleteMany({});
//     }
//   else db.createCollection(COLLECTION_NAME);
//   await client.close();
// };

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

module.exports = {
  // preTest,
  beforeEach,
  before,
  after
};
