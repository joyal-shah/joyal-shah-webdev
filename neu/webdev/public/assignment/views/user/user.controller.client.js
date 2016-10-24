(function(){
    angular
        .module("WebAppMaker")
        .controller("LoginController",LoginController)
        .controller("ProfileController",ProfileController)
        .controller("RegisterController", RegisterController);

    function LoginController($location, UserService){

        var vm = this;
        vm.error = null;
        vm.login = login;

        function login(username, password){
            var user = UserService.findUserByCredentials(username,password);

            if(user === null){
                vm.error = "No such user";
            }
            else{
                $location.url("/user/" + user._id);
            }
        }
    }

    function ProfileController($routeParams, UserService){

        var vm = this;
        vm.updateProfile = updateProfile;

        function init(){
            var userId = UserService.findUserById($routeParams.uid);

            if(userId != null) {
                vm.user = userId;
            }
            else{
                vm.error = "No such user";
            }
        }
        init();

        function updateProfile(userId){
            isUpdateSuccessful = UserService.updateUser(userId,vm.user);

            if(isUpdateSuccessful){
                vm.success = "User successfully updated";
            }
            else {
                vm.error = "Failed to update user";
            }
        }
    }

    function RegisterController($location, UserService){
        var vm = this;
        vm.createNewUser = createNewUser;

        function createNewUser(user){

            if(user.password === user.verifypassword) {
                isUserCreated = UserService.createUser(user);

                if (isUserCreated != null) {
                    $location.url("/user/" + isUserCreated._id);
                }
                else {
                    vm.error = "Failed to create user. Please try again!!"
                }
            }
            else{
                vm.error = "Passwords do not match!!"
            }
        }
    }
})();