(function(){
    angular
        .module("CampApp")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, ProjectUserService, $rootScope) {
        var vm = this;

        vm.createUser = createUser;

        function createUser(newUser) {

            if (newUser.password === newUser.verifypass) {
                ProjectUserService
                    .register(newUser)
                    .then(
                        function (response) {
                            var user = response.data;
                            if (user) {
                                debugger;
                                $rootScope.currentUser = user;
                                $location.url("/user");
                            }
                            else {
                                $rootScope.currentUser = null;
                                vm.error = "unable to create user.";
                            }
                         },
                        function(err){
                            $rootScope.currentUser = null;
                            vm.error = err;
                        }
                    );
            }
        }
    }
})();