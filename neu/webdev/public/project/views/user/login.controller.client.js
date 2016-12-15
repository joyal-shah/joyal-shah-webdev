(function () {
    angular
        .module("CampApp")
        .controller("LogInController", LogInController);


    function LogInController($location, ProjectUserService, $rootScope) {
        var vm = this;

        vm.login = function (username, password) {
            ProjectUserService
                .login(username, password)
                .then(function (response) {
                        var user = response.data;
                        if (user && user._id) {
                            $rootScope.currentUser = user;
                            $location.url("/user");
                        } else {
                            $rootScope.currentUser = null;
                            vm.error = "User not found";
                        }
                    },
                    function (err) {
                        $rootScope.currentUser = null;
                        vm.error = "User not found";
                    });
        }
    }
})();