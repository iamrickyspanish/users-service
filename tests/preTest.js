const { client } = require("./fixtures");

const COLLECTION_NAME = "users";

(async () => {
  await client.connect();
  const db = client.db("users-test");
  const collections = await db.listCollections().toArray();
  const exists = !!collections.find((c) => c.name === COLLECTION_NAME);
  if (exists) {
    const collection = db.collection("users");
    await collection.deleteMany();
  } else await db.createCollection(COLLECTION_NAME);
  await client.close();
})();
