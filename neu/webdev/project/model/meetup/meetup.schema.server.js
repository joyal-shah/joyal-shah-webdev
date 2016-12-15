module.exports = function() {

    var mongoose = require("mongoose");
    var EventSchema = mongoose.Schema ({

        users : [{type: mongoose.Schema.Types.ObjectId, ref: "memberModel"}],
        eventObject    : Object,
        comments    : [{type: mongoose.Schema.Types.ObjectId, ref: "commentModel"}],
        dateCreated : {type: Date, default : Date.now}
    },{collection : "project.event"});
    return EventSchema;
};