"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const getUrl = () =>
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_HOST
    : process.env.DB_HOST;

const UserSchema = new Schema({
  id: ObjectId,
  email: { type: String, unique: true, trim: true, lowercase: true },
  password: String
});

let User = null;

try {
  User = mongoose.model("User");
} catch (e) {
  User = mongoose.model("User", UserSchema);
}

const mongooseOptions = Object.freeze({
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const defaultOptions = Object.freeze({
  notFoundError: "item not found",
  noDatabaseError: "database not available",
  alreadyRegistereddError: "Email already registered",
  authError: "invalid credentials",
  hashPasswordFn: (f) => f,
  comparePasswordFn: (f) => f
});

class UserService {
  constructor(options = {}) {
    this.options = {
      ...defaultOptions,
      ...options
    };
    const url = getUrl();
    mongoose.connect(url, mongooseOptions);
    mongoose.connection.once("open", function () {
      console.log("MongoDB database connection established successfully");
    });
  }

  isReady() {
    return mongoose.connection.readyState === 1;
  }

  async #hashPassword(password) {
    try {
      return await this.options.hashPasswordFn(password);
    } catch (err) {
      throw `could not hash password: ${err}`;
    }
  }

  async get(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw this.options.notFoundError;
    const user = await User.findById(id).lean();
    if (!user) throw this.options.notFoundError;
    delete user.password;
    return user;
  }

  async index(data = {}) {
    const users = await User.find(data);
    return users.map((user) => {
      const { _doc: userData } = user;
      delete userData.password;
      return userData;
    });
  }

  async destroy(_id) {
    if (!mongoose.Types.ObjectId.isValid(_id)) throw this.options.notFoundError;
    const user = await User.findOneAndDelete({ _id });
    if (!user) throw this.options.notFoundError;
    return user;
  }

  async create(data = {}) {
    const hashedPassword = await this.#hashPassword(data.password);
    if (data.email && (await User.countDocuments({ email: data.email })))
      throw this.options.alreadyRegistereddError;
    const newData = {
      ...data,
      password: hashedPassword
    };
    const user = new User(newData);
    const { _doc: userData } = await user.save();
    delete userData.password;
    return userData;
  }

  async update(_id, data = {}) {
    if (!mongoose.Types.ObjectId.isValid(_id)) throw this.options.notFoundError;
    const newData = {
      ...data,
      password: data.password
        ? await this.#hashPassword(data.password)
        : undefined
    };
    const { _doc: user } = await User.findOneAndUpdate({ _id }, newData, {
      new: true
    });
    if (!user) throw this.options.notFoundError;
    delete user.password;
    return user;
  }

  async authenticate({ email, password }) {
    try {
      const { _doc: user } = await User.findOne({ email });
      if (!user) throw this.options.authError;
      if (!(await this.options.comparePasswordFn(password, user.password)))
        throw this.options.authError;
      delete user.password;
      return user;
    } catch (err) {
      throw this.options.authError;
    }
  }
}

module.exports = UserService;
