(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController);

    function LoginController($location, $rootScope,UserService) {

        var vm = this;
        vm.error = null;
        vm.login = login;

        function login(username, password) {
            //var promise = UserService.findUserByCredentials(username, password);
            var promise = UserService.login(username,password);
            promise
                .success(function (user) {
                    $rootScope.currentUser = user;
                    $location.url("/user/"+user._id);
                    //$location.url("/user");
                })
                .error(function (err) {
                    vm.error = err;
                });
        }
    }

    function ProfileController($routeParams, UserService,$location, $rootScope) {

        var vm = this;
        vm.updateProfile = updateProfile;
        vm.unregisterUser = unregisterUser;
        vm.logout = logout;

        function init() {
            //var promise = UserService.findUserById($routeParams.uid);
            var promise = UserService.findCurrentUser();
            promise
                .success(function (user) {
                    if (user === '0') {
                        vm.error = "No such user";
                    }
                    else {
                        vm.user = user;
                        vm.userId = $routeParams.uid;
                    }
                })
                .error(function (err) {
                    vm.error = err;
                });
        }

        init();

        function unregisterUser() {
            UserService.deleteUser(vm.userId)
                .success(function () {
                    $location.url("/login");
                })
                .error(function (err) {
                    $rootScope.currentUser = null;
                    vm.error = err;
                });
        }

        function updateProfile(userId) {
            if(vm.user.username != "") {
                UserService.updateUser(userId, vm.user)
                    .then(function (response) {
                        vm.error = "";
                        vm.success = "User successfully updated";
                    }, function (error) {
                        vm.success = "";
                        vm.error = "Failed to update user";
                    });
            }
            else{
                vm.error = "Username cannot be blank!!!";
            }
        }

        function logout(){
            UserService
                .logout()
                .success(function(){
                    $rootScope.currentUser = null;
                    $location.url("/login");
                })
        }
    }

    function RegisterController($location, UserService,$rootScope) {
        var vm = this;
        vm.createNewUser = createNewUser;

        function createNewUser(user) {

            if (user.password === user.verifypassword) {
                var findUserPromise = UserService.findUserByUsername(user.username);

                findUserPromise
                    .success(function (resUser) {
                        if(resUser != '0'){
                            vm.error = "User already existing!! Please try different username";
                        }
                        else{
                            //var promise = UserService.createUser(user);
                            var promise = UserService.register(user);
                            promise
                                .success(function (user) {
                                    $rootScope.currentUser = user;
                                    $location.url("/user/" + user._id);
                                })
                                .error(function (err) {
                                    vm.error = "Failed to create user. Please try again!!"
                                });
                        }
                    })
                    .error(function (err) {
                        vm.error = err;
                    });
            }
            else {
                vm.error = "Passwords do not match!!"
            }
        }
    }
})();