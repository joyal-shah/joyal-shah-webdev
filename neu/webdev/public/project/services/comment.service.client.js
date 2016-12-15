(function(){
    angular
        .module("CampApp")
        .factory("CommentService", CommentService);

    function CommentService($http) {
        var api = {
            createComment : createComment,
            findCommentsForEvent : findCommentsForEvent,
            findCommentById : findCommentById,
            updateComment : updateComment,
            deleteComment : deleteComment
        };
        return api;

        function createComment(comment, userId, eventId, uname) {
            return $http.post("/project/api/user/"+userId+"/event/"+eventId+"/comment", {text : comment, username: uname});
        }

        function findCommentsForEvent(eventId){
            return $http.get("/project/api/event/"+eventId+"/comments");
        }

        function findCommentById( commentId){
            return $http.get("/project/api/comment/"+commentId);
        }

        function updateComment(comment){
            return $http.post("/project/api/comment/"+comment._id+"/update",comment);
        }

        function deleteComment(commentId, eventId){
            return $http.delete("/project/api/event/"+eventId+"/comment/"+commentId);
        }
    }
})();