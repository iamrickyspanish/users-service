const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const getUrl = () =>
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_HOST
    : process.env.DB_HOST;

const UserSchema = new Schema({
  id: ObjectId,
  email: String,
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
  hashPasswordFn: (f) => f
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

  async #hasPassword(password) {
    try {
      return await this.options.hashPasswordFn(password);
    } catch (err) {
      throw `could not hash password: ${err}`;
    }
  }

  async get(id) {
    const user = await User.findById(id);
    if (!user) throw this.options.notFoundError;
    return user;
  }

  async index(data = {}) {
    return await User.find(data);
  }

  async destroy(_id) {
    const user = await User.findOneAndDelete({ _id });
    if (!user) throw this.options.notFoundError;
    return user;
  }

  async create(data = {}) {
    const hashedPassword = await this.#hasPassword(data.password);
    const newData = {
      ...data,
      password: hashedPassword
    };
    const user = new User(newData);
    return await user.save();
  }

  async update(_id, data = {}) {
    const newData = {
      ...data,
      password: data.password
        ? await this.#hasPassword(data.password)
        : undefined
    };
    const user = await User.findOneAndUpdate({ _id }, newData, { new: true });
    if (!user) throw this.options.notFoundError;
    return user;
  }

  async authenticate({ email, password }) {
    try {
      const user = await User.find({ email });
      if (!user) throw "user not found";
      const hashedPassword = await this.#hasPassword(password);
      if (user.password !== hashedPassword) throw "wrong password";
      return user;
    } catch (err) {
      throw `authentication error: ${err}`;
    }
  }
}

module.exports = UserService;
