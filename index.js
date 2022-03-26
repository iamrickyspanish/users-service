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
  alreadyRegistereddError: createError(400, "email already registered"),
  authError: createError(401, "authentication error"),
  hashPasswordFn: passwordService.hash.bind(passwordService),
  comparePasswordFn: passwordService.compare.bind(passwordService)
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
      if (id === "auth") {
        const user = await service.authenticate(await json(req));
        return send(res, 200, user);
      } else {
        const user = await service.create(await json(req));
        return send(res, 201, user);
      }
    case "PATCH":
      return service.update(id, await json(req));
    case "DELETE":
      return service.destroy(id);
    default:
      throw routeNotFoundError;
  }
};
