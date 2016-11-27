module.exports = function (app, model) {

    /*
     var websites = [
     {_id: "123", name: "Facebook", developerId: "456", description: "Lorem"},
     {_id: "234", name: "Tweeter", developerId: "456", description: "Lorem"},
     {_id: "456", name: "Gizmodo", developerId: "456", description: "Lorem"},
     {_id: "567", name: "Tic Tac Toe", developerId: "123", description: "Lorem"},
     {_id: "678", name: "Checkers", developerId: "123", description: "Lorem"},
     {_id: "789", name: "Chess", developerId: "234", description: "Lorem"}
     ];*/

    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    function createWebsite(req, res) {

        var userId = req.params.userId;
        var newWebsite = req.body;

        model
            .websiteModel
            .createWebsiteForUser(userId, newWebsite)
            .then(
                function (newWebsite) {
                    res.send(newWebsite);
                },
                function (err) {
                    res.sendStatus(400).send(err);
                });
    }

    function findAllWebsitesForUser(req, res) {

        var userId = req.params.userId;

        model
            .websiteModel
            .findAllWebsitesForUser(userId)
            .then(
                function (websites) {
                    res.json(websites);
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }

    function findWebsiteById(req, res) {

        var websiteId = req.params.websiteId;

        model
            .websiteModel
            .findWebsiteById(websiteId)
            .then(
                function (website) {
                    res.json(website);
                },
                function (err) {
                    res.sendStatus(400).send(err);
                });
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var website = req.body;

        model
            .websiteModel
            .updateWebsite(websiteId, website)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteWebsite(req, res) {

        var websiteId = req.params.websiteId;

        model
            .websiteModel
            .deleteWebsite(websiteId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
};