const { json, send, createError } = require("micro");
const query = require("micro-query");
const url = require("url");
const PasswordService = require("./lib/passwordService");
const UserService = require("./lib/userService");

const passwordService = new PasswordService({
  invalidFormatError: createError(400, "invalid format")
});

const service = new UserService({
  notFoundError: createError(404, "item not found"),
  noDatabaseError: createError(500, "no db connection"),
  hashPasswordFn: passwordService.hash.bind(passwordService)
});

const mapRequestToId = (req) => {
  const { pathname } = new url.URL(req.url, `http://${req.headers.host}`);
  return pathname.slice(1).split("/")[0];
};

const routeNotFoundError = createError(404, "route not found");

module.exports = async (req, res) => {
  if (!service.isReady()) throw noDbConnectionError;
  const id = mapRequestToId(req);
  if ((req.method === "PUT" || req.method === "DELETE") && !id)
    throw routeNotFoundError;
  switch (req.method) {
    case "GET":
      return id ? service.get(id) : service.index(query(req));
    case "POST":
      return id === "auth"
        ? await service.authenticate(await json(req))
        : send(res, 201, await service.create(await json(req)));
    case "PUT":
      return service.update(id, await json(req));
    case "DELETE":
      return service.destroy(id);
    default:
      throw routeNotFoundError;
  }
};
