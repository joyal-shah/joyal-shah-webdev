module.exports = function (app) {

    var model = require("./model/models.server")();

    require("./services/member.service.server.js")(app, model);
    require("./services/meetup.service.server.js")(app, model);
    require("./services/comment.service.server.js")(app, model);

};