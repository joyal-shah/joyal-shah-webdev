module.exports = function () {
    var mongoose = require("mongoose");

    var UserSchema = mongoose.Schema({
        username: {type: String, required: true},
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        dateCreated: {type: Date, default: Date.now()},
        websites: [{type: mongoose.Schema.Types.ObjectId, ref:'websiteModel'}]
    },{collection: "user"});
    return UserSchema;
};