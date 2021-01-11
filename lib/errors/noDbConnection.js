const { createError } = require("micro");

module.exports = createError(500, "no db connection");
