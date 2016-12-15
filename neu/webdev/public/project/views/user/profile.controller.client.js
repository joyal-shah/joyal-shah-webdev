(function(){
    angular
        .module("CampApp")
        .controller("ProfileController", ProfileController);

    function ProfileController($location, $routeParams, ProjectUserService, $rootScope) {
        var vm = this;

        vm.updateUser = updateUser;
        vm.unregister = unregister;
        vm.logout = logout;
        vm.searchForEvent = searchForEvent;
        vm.addUser = addUser;
        vm.manageUsers = manageUsers;

        vm.isAdmin = false;
        var id = $rootScope.currentUser._id;
        $rootScope.isAdmin = false;

            function init() {
                ProjectUserService
                .findUserById(id)
                .then(function (response){
                    vm.user = response.data;
                    if(vm.user.userType === "admin"){
                        vm.isAdmin = true;
                        $rootScope.isAdmin = true;
                        ProjectUserService
                            .getUsers()
                            .then(function(users){
                                vm.adminUsers = users.data;
                            })
                    }
                });
        }
        init();

        function updateUser(newUser) {
            ProjectUserService
                .updateUser(id, newUser)
                .then(
                    function(response) {
                        vm.success = "Updated successfully";
                    },
                    function(error) {
                        vm.error = "Unable to update user"
                    }
                );
        }

        function logout() {
            ProjectUserService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    },
                    function(err){
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    }
                )
        }

        function unregister() {
            ProjectUserService
                .deleteUser(id)
                .then(
                    function(stats){
                       logout();
                    },
                    function(err) {
                        vm.error = "Unable to remove user."
                    }
                );
        }

        function searchForEvent(searchText) {
            $location.url("/user/"+id+"/events/"+searchText);
        }

        function addUser(uname, pass){
            var newUser = {
                username : uname,
                password : pass

            };
            ProjectUserService
                .register(newUser)
                .then(
                    function (response) {
                        var user = response.data;
                        init();
                    },
                    function(err){
                        vm.error = err;
                    }
                );
        }

        function manageUsers(){
            $location.url('/admin');
        }
    }
})();