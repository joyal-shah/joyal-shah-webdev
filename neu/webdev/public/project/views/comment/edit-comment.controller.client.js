(function(){
    angular
        .module("CampApp")
        .controller("EditCommentController", EditCommentController);

    function EditCommentController(CommentService, $routeParams, $rootScope,$location) {
        var vm = this;

        vm.eventId = $routeParams.eventId;
        vm.currentUser = $rootScope.currentUser;
        vm.commentId = $routeParams.commentId;
        vm.groupdUrl = $routeParams.groupId;
        vm.meetupId  = $routeParams.meetupId;
        
        vm.updateComment = updateComment;
        vm.deleteComment = deleteComment;

        function init() {
            CommentService
                .findCommentById(vm.commentId)
                .then(
                    function (response) {
                        vm.comment = response.data;
                    }, function (err) {
                        console.log(err);
                    });
        }
        init();

        function updateComment(comment) {

            CommentService
                .updateComment(comment)
                .then(
                    function (response) {
                        $location.url("/group/"+vm.groupdUrl+"/event/"+vm.meetupId);
                    }, function (err) {
                        console.log(err);
                    });
        }
        
        function deleteComment(commentId) {

            CommentService
                .deleteComment(commentId, vm.eventId)
                .then(
                    function (response) {
                        $location.url("/group/"+vm.groupdUrl+"/event/"+vm.meetupId);
                    }, function (err) {
                        console.log(err);
                    });
        }
    }
})();