module.exports = function () {
    var mongoose = require("mongoose");

    var WebsiteSchema = mongoose.Schema({
            _user: {type: mongoose.Schema.ObjectId, ref: "userModel"},
            name: {type: String, required: true},
            description: String,
            dateCreated: {type: Date, default: Date.now()},
            pages: [{type: mongoose.Schema.Types.ObjectId, ref:'pageModel'}]
        },
        {collection: "website"});

    return WebsiteSchema;
};