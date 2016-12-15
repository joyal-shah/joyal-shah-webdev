module.exports = function(){
    var model = {};
    var mongoose = require("mongoose");
    var EventSchema = require("./meetup.schema.server")();
    var Event = mongoose.model("meetupModel", EventSchema);

    var api = {
        createEvent           : createEvent,
        findEventForUser       : findEventForUser,
        removeEvent      : removeEvent,
        findEventById           : findEventById,
        findEventByMeetupId : findEventByMeetupId,
        findEventByMeetupIdForUser : findEventByMeetupIdForUser,
        findAllEventsWithUser : findAllEventsWithUser,

        addUserToEvent : addUserToEvent,
        removeUserFromEvent : removeUserFromEvent,

        // Comments

        addCommentToEvent : addCommentToEvent,
        deleteCommentForEvent : deleteCommentForEvent,
        setModel: setModel
    };

    return api;

    function setModel(_model){
        model = _model;
    }

    function createEvent(userId, event){
        delete event._id;
        var newEvent = {
            users : [userId],
            eventObject : event,
        };
        return Event.create(newEvent);
    }

    function findEventForUser(userId, eventId){
        return Event.findOne({user :userId, _id : eventId});
    }

    function findEventById(eventId){
        return Event.findById(eventId);
    }
    function findEventByMeetupIdForUser(userId, meetupId){
        return Event.findOne({user: userId, 'eventObject.id' : meetupId});
    }

    function findEventByMeetupId(meetupId){
        return Event.findOne({'eventObject.id' : meetupId});
    }

    function addUserToEvent(userId, eventId){
        return Event.findById(eventId ,
            function (err, event) {
                if (!err) {
                    event.users.push(userId);
                    event.save();
                }
            }
        );
    }
    function removeUserFromEvent(userId, eventId){
        return Event.findById(eventId,
            function (err, event) {
                if(!err) {
                    for(var user in event.users){
                        if(event.users[user] == userId) {
                            event.users.splice(user, 1);
                            event.save();
                        }
                    }
                }});
    }

    function removeEvent(eventId){
        return Event.remove({_id :eventId});
    }



    function addCommentToEvent(eventId,commentId){
        return Event.findById(eventId ,
            function (err, event) {
                if (!err) {
                    event.comments.push(commentId);
                    event.save();
                }
            }
        );
    }


    function deleteCommentForEvent(eventId, commentId){
        return Event.findById(eventId,
            function (err, event) {
                if(!err) {
                    for(var comment in event.comments){
                        if(event.comments[comment] == commentId) {
                            event.comments.splice(comment, 1);
                            event.save();
                        }
                    }
                }});
    }

    function findAllEventsWithUser(userId){
        return Event.find({users : {"$in" : [userId]}});
    }
};