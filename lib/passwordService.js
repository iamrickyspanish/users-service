const bcrypt = require("bcrypt");
const saltRounds = 10;

const defaultOptions = Object.freeze({
  invalidFormatError: "invalid format"
});

module.exports = class PasswordService {
  constructor(options) {
    this.options = { ...defaultOptions, ...options };
  }

  #validatePassword(password) {
    if (typeof password === "string" && password.length < 6) {
      throw this.options.invalidFormatError;
    }
    return true;
  }

  async hash(password) {
    this.#validatePassword(password);
    return await bcrypt.hash(password, saltRounds);
  }

  async compare(password, hash) {
    this.#validatePassword(password);
    return await bcrypt.compare(password, hash);
  }
};
