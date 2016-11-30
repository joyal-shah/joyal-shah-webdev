module.exports = function () {
    var model = {};
    var mongoose = require('mongoose');
    var WebsiteSchema = require('./website.schema.server')();
    var WebsiteModel = mongoose.model("websiteModel", WebsiteSchema);

    var api = {
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function createWebsiteForUser(userId, website) {
        //website._user = userId;
        //return WebsiteModel.create(website);
        return WebsiteModel
            .create(website)
            .then(
                function (newWebsite) {
                    return model
                        .userModel
                        .findUserById(userId)
                        .then(
                            function (user) {
                                user.websites.push(newWebsite);
                                newWebsite._user = user._id;
                                user.save();
                                newWebsite.save();
                                return newWebsite;
                            },
                            function (error) {
                                console.log(error);
                            }
                        );
                },
                function (error) {
                    console.log(error);
                });
    }

    function findAllWebsitesForUser(userId) {
        return WebsiteModel.find({"_user": userId});
    }

    function findWebsiteById(websiteId) {
        return WebsiteModel.findById(websiteId);
    }

    function updateWebsite(websiteId, website) {
        return WebsiteModel
            .update({_id: websiteId}, {
                $set: website
            });
    }

    function deleteWebsite(websiteId) {
        return model
            .websiteModel
            .findWebsiteById(websiteId)
            .then(function (website) {
                return model
                    .userModel
                    .findUserById(website._user)
                    .then(
                        function (user) {
                            //Remove reference of websiteId in user.websites array
                            for (var i = 0; i < user.websites.length; ++i) {
                                if (website._id.equals(user.websites[i])) {
                                    user.websites.splice(i, 1);
                                    user.save();
                                    break;
                                }
                            }

                            var pages = website.pages;

                            if (0 === pages.length) {
                                return WebsiteModel.remove({_id: websiteId});
                            }
                            else {

                                for (j = 0; j < pages.length; j++) {
                                    return model
                                        .pageModel
                                        .deletePage(pages[j])
                                        .then(
                                            function (status) {
                                                if (0 === pages.length) {
                                                    return WebsiteModel.remove({_id: websiteId});
                                                }
                                                else{
                                                    return deleteWebsite(websiteId);
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
                        }
                    )

            });
    }
};