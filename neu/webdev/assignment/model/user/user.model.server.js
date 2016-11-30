module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server")();
    var UserModel = mongoose.model("userModel", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        updateUser: updateUser,
        findUserByCredentials: findUserByCredentials,
        deleteUser: deleteUser,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function updateUser(userId, user) {
        return UserModel
            .update(
                {
                    _id: userId
                },
                {
                    $set: user
                }
            );
    }

    function deleteUser(userId) {
        return model
            .userModel
            .findUserById(userId)
            .then(function (user) {

                    var websites = user.websites;

                    if (0 === websites.length) {
                        return UserModel.remove({_id: userId});
                    }
                    else {

                        for (j = 0; j < websites.length; j++) {
                            return model
                                .websiteModel
                                .deleteWebsite(websites[j])
                                .then(
                                    function (status) {
                                        if (0 === websites.length) {
                                            return UserModel.remove({_id: userId});
                                        }
                                        else {
                                            return deleteUser(userId);
                                        }
                                    },
                                    function (error) {
                                        console.log(error);
                                    }
                                );
                        }
                    }

                },
                function (error) {
                    console.log(error);
                });
    }

    function deleteUser1(userId) {
        return UserModel.remove({_id: userId});
    }

    function findUserByCredentials(username, password) {
        return UserModel.find({
            username: username,
            password: password
        });
    }

    function findUserByUsername(username) {
        return UserModel.find({
            username: username
        });
    }
};