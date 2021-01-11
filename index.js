const { json, send } = require("micro");
const query = require("micro-query");
const url = require("url");
const User = require("./lib/user");
const db = require("./lib/db");
const notFoundError = require("./lib/errors/notFound");
const noDbConnectionError = require("./lib/errors/noDbConnection");

mapRequestToId = (req) => {
  const { pathname } = url.parse(req.url, true);
  return pathname.split("/").filter((f) => f)[0];
};

module.exports = async (req, res) => {
  if (db.readyState !== 1) throw noDbConnectionError;
  if (req.method === "POST") {
    const user = new User(await json(req));
    return send(res, 201, await user.save());
  }
  const id = mapRequestToId(req);
  if (id) {
    const user = await User.findById(id);
    if (!user) throw notFoundError;
    if (req.method === "GET") {
      return user;
    } else if (req.method === "PUT") {
      return user.update(await json(req), { new: true });
    } else if (req.method === "DELETE") {
      return user.delete();
    }
  } else {
    if (req.method === "GET") {
      return User.find(query(req));
    }
  }
  throw notFoundError;
};
