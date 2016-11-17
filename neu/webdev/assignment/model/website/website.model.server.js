module.exports = function(){
    var mongoose = require('mongoose');
    var WebsiteSchema = require('./website.schema.server')();
    var WebsiteModel = mongoose.model("websiteModel", WebsiteSchema);

    var api = {
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite
    };
    return api;

    function createWebsiteForUser(userId, website){
        website._user = userId;
        return WebsiteModel.create(website);
    }

    function findAllWebsitesForUser(userId){
        return WebsiteModel.find({"_user": userId});
    }

    function findWebsiteById(websiteId){
        return WebsiteModel.findById(websiteId);
    }

    function updateWebsite(websiteId, website){
        return WebsiteModel
            .update({_id: websiteId}, {
                $set: website
            });
    }

    function deleteWebsite(websiteId){
        return WebsiteModel.remove({_id: websiteId});
    }
};