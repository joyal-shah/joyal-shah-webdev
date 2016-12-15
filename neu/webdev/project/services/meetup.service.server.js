module.exports = function(app, models) {

    var memberModel = models.memberModel;
    var eventModel = models.meetupModel;

    app.get("/project/api/user/:userId/events", findAllEventsForUser);
    app.get("/project/api/user/:userId/favourite/:eventId", findUserEventById);
    app.post("/project/api/user/:userId/event",createEventForUser);
    app.get("/project/api/user/:userId/event/:eventId", removeEventFromUser);
    app.get("/project/api/user/:userId/meetup/:meetupId", findEventByMeetupIdForUser);
    app.get("/project/api/meetupevent/:meetupId",findEventByMeetupId );
    app.get("/project/api/user/:userId/event/:eventId/update", updateEventAndUSerReferences);
    app.delete("/project/api/event/:eventId", deleteEvent);

    function findAllEventsForUser (req, res) {
        var userId = req.params.userId;
        eventModel
            .findAllEventsWithUser(userId)
            .then(function(events){
                    res.send(events);
                },
                function(err){
                    res.statusCode(404).send(err);
                }
            );

    }

    function findUserEventById (req, res) {
        var userId = req.params.userId;
        var eventId = req.params.eventId;
        eventModel
            .findEventById(eventId)
            .then(
                function(event){
                    res.json(event);
                },
                function(err){
                    res.statusCode(404).send(err);

                });
    }

    function createEventForUser (req, res) {
        var userId = req.params.userId;
        var event = req.body;
        eventModel
            .createEvent(userId, event)
            .then(
                function (eventCreated) {
                    memberModel
                        .addEventReferenceToUser(userId, eventCreated._id)
                        .then(
                            function(user){
                                res.json(eventCreated);
                            });
                },
                function (err) {
                    res.statusCode(400).send(err);

                });
    }

    function removeEventFromUser (req, res) {
        var userId = req.params.userId;
        var eventId = req.params.eventId;
        memberModel
            .removeEventFromUser(userId, eventId)
            .then(
                function(user){
                    eventModel
                        .removeUserFromEvent(userId, eventId)
                        .then(function (eventRemoved) {
                                res.json(eventRemoved);
                            },
                            function (err) {
                                res.statusCode(400).send(err);
                            });
                },
                function (err) {
                    res.statusCode(400).send(err);

                });
    }

    function findEventByMeetupIdForUser (req, res) {
        var userId = req.params.userId;
        var meetupId = req.params.meetupId;

        eventModel
            .findEventByMeetupIdForUser(userId, meetupId)
            .then(function (event) {
                    res.json(event);
                },
                function (err) {
                    res.statusCode(400).send(err);
                });
    }

    function findEventByMeetupId (req, res) {
        var meetupId = req.params.meetupId;

        eventModel
            .findEventByMeetupId(meetupId)
            .then(function (event) {
                    res.json(event);
                },
                function (err) {
                    res.statusCode(400).send(err);
                });
    }

    function updateEventAndUSerReferences(req, res) {
        var eventId = req.params.eventId;
        var userId = req.params.userId;
        eventModel
            .addUserToEvent(userId, eventId)
            .then(
                function(event){
                    memberModel
                        .addEventReferenceToUser(userId, eventId)
                        .then(
                            function(user){
                                res.json(event);
                            });
                }
            );
    }

    function deleteEvent (req, res) {
        var eventId = req.params.eventId;

        eventModel
            .removeEvent(eventId)
            .then(function (event) {
                    res.json(event);
                },
                function (err) {
                    res.statusCode(400).send(err);
                });
    }
};