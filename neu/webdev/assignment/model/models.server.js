module.exports = function(){
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://root:admin@ds155087.mlab.com:55087/wam-fall-2016');

    var userModel = require("./user/user.model.server")();

    var model = {
        userModel: userModel
    };
    return model;
}
