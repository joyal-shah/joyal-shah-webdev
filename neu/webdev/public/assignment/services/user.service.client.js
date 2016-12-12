(function () {

    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService($http) {

        var api = {
            createUser: createUser,
            findUserByCredentials: findUserByCredentials,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            findCurrentUser: findCurrentUser,
            updateUser: updateUser,
            deleteUser: deleteUser,
            login:login,
            checkLogin:checkLogin,
            logout:logout,
            register: register
        };
        return api;

        function findCurrentUser(){
            var url = "/api/user/";
            return $http.get(url);
        }

        function logout(){
            return $http.post("/api/logout");
        }

        function checkLogin(){
            return $http.post("/api/checkLogin");
        }

        function login(username,password){
            var user = {
                username: username,
                password: password
            };

            return $http.post("/api/login", user);
        }

        function register(user){
            var newUser = {
                username: user.username,
                password: user.password,
                firstName: "",
                lastName: ""
            };
            return $http.post("/api/register", newUser);
        }

        // Adds the user parameter instance to the local users array
        function createUser(user) {
            var newUser = {
                username: user.username,
                password: user.password,
                firstName: "",
                lastName: ""
            };
            return $http.post("/api/user", newUser);
        }

        // Returns the user in local users array whose username matches the parameter username
        function findUserByUsername(username) {
            var url = "/api/user?username=" + username;
            return $http.get(url);
        }

        // Updates the user in local users array whose _id matches the userId parameter
        function updateUser(userId, user) {
            var url = "/api/user/" + userId;
            return $http.put(url, user);
        }

        // Removes the user whose _id matches the userId parameter
        function deleteUser(userId) {
            var url = "/api/user/" + userId;
            return $http.delete(url);
        }

        // Returns the user whose username and password match the username and password parameters
        function findUserByCredentials(username, password) {
            var url = "/api/user?username=" + username + "&password=" + password;
            return $http.get(url);
        }

        // Returns the user in local users array whose _id matches the userId parameter
        function findUserById(userId) {
            var url = "/api/user/" + userId;
            return $http.get(url);
        }
    }

})();
