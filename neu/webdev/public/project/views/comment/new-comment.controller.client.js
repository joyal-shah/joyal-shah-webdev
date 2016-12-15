(function(){
    angular
        .module("CampApp")
        .controller("NewCommentController", NewCommentController);

    function NewCommentController(CommentService, $routeParams, $rootScope,$location) {
        var vm = this;

        vm.eventId = $routeParams.eventId;
        vm.currentUser = $rootScope.currentUser;
        vm.groupdUrl = $routeParams.groupId;
        vm.meetupId  = $routeParams.meetupId;
        vm.addComment = addComment;

        function addComment(comment){
            CommentService
                .createComment(comment, vm.currentUser._id, vm.eventId, vm.currentUser.username)
                .then(
                    function(response) {

                        $location.url("/group/"+vm.groupdUrl+"/event/"+vm.meetupId);
                    },function(err){
                        console.log(err);
                    });
        }
    }
})();