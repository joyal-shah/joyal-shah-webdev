module.exports = function (app) {

    var websites = [
        {_id: "123", name: "Facebook", developerId: "456", description: "Lorem"},
        {_id: "234", name: "Tweeter", developerId: "456", description: "Lorem"},
        {_id: "456", name: "Gizmodo", developerId: "456", description: "Lorem"},
        {_id: "567", name: "Tic Tac Toe", developerId: "123", description: "Lorem"},
        {_id: "678", name: "Checkers", developerId: "123", description: "Lorem"},
        {_id: "789", name: "Chess", developerId: "234", description: "Lorem"}
    ];

    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    function createWebsite(req, res) {

        var newWebsite = req.body;
        var userId = req.params.userId;
        websites.push(newWebsite);
        res.send(newWebsite);
    }

    function findAllWebsitesForUser(req, res) {

        var userId = req.params.userId;

        result = [];

        for (var w in websites) {

            website = websites[w];

            if (website.developerId === userId) {
                result.push(website);
            }
        }
        res.send(result);

    }

    function findWebsiteById(req, res) {

        var websiteId = req.params.websiteId;

        var websiteFound = 400;

        for (var w in websites) {
            var website = websites[w];
            if (website._id === websiteId) {
                websiteFound = website;
                break;
            }
        }
        res.send(websiteFound);
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var website = req.body;
        var updateSuccessful = 400;
        for(var w in websites){
            var curWebSite = websites[w];
            if(curWebSite._id === websiteId){
                curWebSite.name = website.name;
                curWebSite.description = website.description;
                updateSuccessful = 200;
                break;
            }
        }
        res.sendStatus(updateSuccessful);
    }

    function deleteWebsite(req, res) {

        var websiteId = req.params.websiteId;

        var deleteSuccessful = 400;

        for(var index = 0;index < websites.length; index++){
            if(websites[index]._id === websiteId){
                websites.splice(index,1);
                deleteSuccessful = 200;
                break;
            }
        }

        res.sendStatus(deleteSuccessful);

    }
}
