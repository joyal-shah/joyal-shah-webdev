module.exports = function () {

    var memberModel = require("./member/member.model.server")();
    var meetupModel = require("./meetup/meetup.model.server")();
    var commentModel = require("./comment/comment.model.server")();

    var model = {
        memberModel: memberModel,
        meetupModel: meetupModel,
        commentModel: commentModel,
    };

    commentModel.setModel(model);
    meetupModel.setModel(model);
    memberModel.setModel(model);

    return model;
};