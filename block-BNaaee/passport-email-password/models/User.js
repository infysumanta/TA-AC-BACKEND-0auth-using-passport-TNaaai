var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  password: String,
  email: String,
  avatar: String,
});

userSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 10, function (err, hashedPassword) {
    if (err) next(err);
    this.password = hashedPassword;
  });
});

userSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    callback(err, isMatch);
  });
};
module.exports = mongoose.model("User", userSchema);
