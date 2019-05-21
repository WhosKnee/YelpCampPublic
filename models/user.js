var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// this will add methods to our user model
UserSchema.plugin(passportLocalMongoose);

// create mongo model from schema
var User = mongoose.model("User", UserSchema);

module.exports = User;