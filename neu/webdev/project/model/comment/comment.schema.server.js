module.exports = function() {

    var mongoose = require("mongoose");

    var CommentSchema = mongoose.Schema ({

        _user       : {type: mongoose.Schema.ObjectId , ref : "memberModel"},
        _event      : {type: mongoose.Schema.ObjectId , ref : "meetupModel"},
        text        : String,
        eventId     : String,
        liked       : Boolean,
        myComment   : Boolean,
        username    : String,
        dateCreated : {type: Date, default : Date.now}
    },{collection : "project.comment"});

    return CommentSchema;
};