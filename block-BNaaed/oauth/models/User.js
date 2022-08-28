const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  avatar: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
