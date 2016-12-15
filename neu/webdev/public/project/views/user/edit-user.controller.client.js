(function(){
    angular
        .module("CampApp")
        .controller("EditUserController", EditUserController);

    function EditUserController($location, $routeParams, ProjectUserService, $rootScope) {
        var vm = this;
        var userId = $routeParams.userId;
        vm.updateUserByAdmin = updateUserByAdmin;
        vm.deleteUserByAdmin = deleteUserByAdmin;
        function init() {
            ProjectUserService
                .findUserById(userId)
                .then(function (response){
                    vm.user = response.data;
                    console.log("found");
                });
        }
        init();

        function updateUserByAdmin(newUser) {
            console.log("update");
            ProjectUserService
                .updateUser(userId, newUser)
                .then(
                    function(response) { 
                        $location.url("/user");
                    },
                    function(error) {
                        vm.error = "Unable to update user"
                    }
                );
        }
        
        function deleteUserByAdmin(userId){
            ProjectUserService
                .deleteUser(userId)
                .then(
                    function(stats){
                       $location.url("/user");
                    },
                    function(err) {
                        vm.error = "Unable to remove user."
                    }
                );
        }
    }
})();