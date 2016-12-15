module.exports = function(app, models) {

    var commentModel = models.commentModel;
    var eventModel = models.meetupModel;

    app.post("/project/api/user/:userId/event/:eventId/comment", createComment);
    app.get("/project/api/event/:eventId/comments", findAllCommentsForEvent);
    app.get("/project/api/comment/:commentId", findCommentById);
    app.post("/project/api/comment/:commentId/update", updateComment);
    app.delete("/project/api/event/:eventId/comment/:commentId",deleteComment);

    function createComment(req, res) {
        var userId = req.params.userId;
        var eventId = req.params.eventId;
        var comment = req.body;
        commentModel
            .createComment(comment, userId, eventId)
            .then(
                function(commentCreated){
                    // Add reference to Event
                    eventModel
                        .addCommentToEvent(eventId,commentCreated._id)
                        .then(
                            function(event) {
                                res.json(commentCreated);
                            },
                            function(err){
                                res.statusCode(400).send(err);
                            });

                },
                function(err){
                    res.statusCode(400).send(err);
                }

            );
    }

    function findAllCommentsForEvent (req, res) {
        var eventId = req.params.eventId;

        commentModel
            .findAllCommentsForEvent(eventId)
            .then(
                function(comments){
                    res.json(comments);
                },
                function(err){
                    res.statusCode(404).send(err);
                }
            );
    }


    function findCommentById (req, res) {
        var commentId = req.params.commentId;

        commentModel
            .findCommentById(commentId)
            .then(
                function(comment){
                    res.json(comment);
                },
                function(err){
                    res.statusCode(404).send(err);
                }
            );
    }

    function updateComment (req, res) {
        var commentId = req.params.commentId;
        var newComment = req.body;
        commentModel
            .updateComment(commentId, newComment)
            .then(
                function(comment){
                    res.json(comment);
                },
                function(err){
                    res.statusCode(404).send(err);
                }
            );
    }

    function deleteComment (req, res) {
        var commentId = req.params.commentId;
        var eventId = req.params.eventId;

        commentModel
            .deleteComment(commentId)
            .then(
                function(comment){
                    eventModel
                        .deleteCommentForEvent(eventId, commentId)
                        .then(
                            function(response){
                                res.json(comment);
                            },
                            function(err){
                                res.statusCode(404).send(err);
                            }
                        );

                },
                function(err){
                    res.statusCode(404).send(err);
                }
            );
    }
};