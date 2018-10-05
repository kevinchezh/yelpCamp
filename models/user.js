var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
    username:String,
    password:String
});

//put some method into User model like user.authenticate()
userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User',userSchema);