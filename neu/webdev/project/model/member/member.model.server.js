module.exports = function(){
    var model = {};
    var mongoose = require("mongoose");
    var MemberSchema = require("./member.schema.server")();
    var MemberModel = mongoose.model("memberModel", MemberSchema);

    var api = {

        findGoogleUser          : findGoogleUser,
        createUser              : createUser,
        findUserById            : findUserById,
        findUserByCredentials   : findUserByCredentials,
        findUserByUsername      : findUserByUsername,
        updateUser              : updateUser,
        deleteUser              : deleteUser,
        getUsers                : getUsers,
        findAllEventsForUser    : findAllEventsForUser,
        findEventForUser        : findEventForUser,
        removeEventFromUser     : removeEventFromUser,
        addEventReferenceToUser : addEventReferenceToUser,
        findAllCommentsForEvent : findAllCommentsForEvent,
        addCommentToUser : addCommentToUser,
        removeCommentFromUser : removeCommentFromUser,
        setModel: setModel
    };

    return api;

    function setModel(_model){
        model = _model;
    }

    function createUser(user){
        user.userType = "user";
        return MemberModel.create(user);
    }

    function findUserById(userId){
        return MemberModel.findById(userId);
    }

    function findGoogleUser(id) {
        return MemberModel.findOne({"google.id": id});
    }

    function findUserByCredentials(username, password){
        return MemberModel.findOne({username : username, password : password });
    }

    function findUserByUsername(username, password){
        return MemberModel.findOne({username : username});
    }

    function findAllEventsForUser(userId){
        return MemberModel.findById(userId).select('events');
    }

    function findEventForUser(userId, eventId){
        return MemberModel.findById(userId,
            function(err, user) {
                user.events.id(eventId);
            });
    }

    function addEventReferenceToUser(userId, eventId){
        return MemberModel.findById(userId ,
            function (err, user) {
                if (!err) {
                    user.events.push(eventId);
                    user.save();
                }
            }
        );
    }

    function removeEventFromUser(userId, eventId){
        return MemberModel.findById(userId,
            function (err, user) {
                if(!err) {
                    for(var event in user.events){
                        if(user.events[event] == eventId) {
                            user.events.splice(event, 1);
                            user.save();
                        }
                    }
                }});
    }

    function updateUser(id,user){
        delete user._id;
        return MemberModel
            .update({_id : id},{
                $set : {
                    firstName   : user.firstName,
                    lastName    : user.lastName
                }
            });
    }

    function deleteUser(userId){
        return MemberModel.remove({_id : userId});
    }

    function getUsers(){
        return MemberModel.find({userType : "user"},'username email', function(err, docs){});
    }

    function findAllCommentsForEvent(userId){
        return MemberModel.findOne({_id:userId}).select('likedComments');
    }

    function addCommentToUser(userId, commentId){
        return MemberModel.findById(userId ,
            function (err, user) {
                if (!err) {
                    user.likedComments.push(commentId);
                    user.save();
                }
            }
        );
    }

    function removeCommentFromUser(userId, commentId){
        return MemberModel.findById(userId,
            function (err, user) {
                if(!err) {
                    for(var comment in user.likedComments){
                        if(user.likedComments[comment] == commentId) {
                            user.likedComments.splice(comment, 1);
                            user.save();
                        }
                    }
                }});
    }

};