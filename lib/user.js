const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  id: ObjectId,
  email: String,
  password: String,
});

let user = null;
try {
  user = mongoose.model("Name");
} catch (e) {
  user = mongoose.model("Name", UserSchema);
}
module.exports = user;
