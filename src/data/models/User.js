const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

//hashing a password before saving it to the database
UserSchema.pre("save", function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

//authenticate input against database
UserSchema.statics.authenticate = function(User, email, password, callback) {
  console.log("statistics auth");
  User.findOne({ email: email }).exec(function(err, user) {
    if (err) {
      console.log(err);
      return callback(err);
    } else if (!user) {
      var err = new Error("User not found.");
      err.status = 401;
      console.log("no user");
      return callback(err);
    }
    bcrypt.compare(password, user.password, function(err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback(new Error("Password does not match"));
      }
    });
  });
};

// Compile model from schema
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
