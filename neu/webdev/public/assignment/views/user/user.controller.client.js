(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController);

    function LoginController($location, UserService) {

        var vm = this;
        vm.error = null;
        vm.login = login;

        function login(username, password) {
            var promise = UserService.findUserByCredentials(username, password);
            promise
                .success(function (user) {
                    if (user === '0') {
                        vm.error = "No such user";
                    }
                    else {
                        $location.url("/user/" + user._id);
                    }
                })
                .error(function (err) {
                    vm.error = err;
                });
        }
    }

    function ProfileController($routeParams, UserService) {

        var vm = this;
        vm.updateProfile = updateProfile;

        function init() {

            var promise = UserService.findUserById($routeParams.uid);
            promise
                .success(function (user) {
                    if (user === '0') {
                        vm.error = "No such user";
                    }
                    else {
                        vm.user = user;
                    }
                })
                .error(function (err) {
                    vm.error = err;
                });
        }

        init();

        function updateProfile(userId) {
            UserService.updateUser(userId, vm.user)
                .then(function (response) {
                    vm.success = "User successfully updated";
                }, function (error) {
                    vm.error = "Failed to update user";
                });
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.createNewUser = createNewUser;

        function createNewUser(user) {

            if (user.password === user.verifypassword) {
                var findUserPromise = UserService.findUserByUsername(user.username);

                findUserPromise
                    .success(function (user) {
                        vm.error = "User already existing!! Please try different username";
                    })
                    .error(function (err) {
                        var promise = UserService.createUser(user);
                        promise
                            .success(function (user) {
                                $location.url("/user/" + user._id);
                            })
                            .error(function (err) {
                                vm.error = "Failed to create user. Please try again!!"
                            });
                    });
            }
            else {
                vm.error = "Passwords do not match!!"
            }
        }
    }
})();