(function() {
    angular
        .module("CampApp")
        .factory("ProjectUserService", ProjectUserService);

    function ProjectUserService($http) {
        var api = {
            createUser: createUser,
            login : login,
            logout: logout,
            loggedIn: loggedIn,
            register: register,
            findUserById: findUserById,
            findUserByUsername : findUserByUsername,
            findUserByUsernameAndPassword: findUserByUsernameAndPassword,
            updateUser: updateUser,
            deleteUser: deleteUser,
            findCommentsForUser : findCommentsForUser,
            addCommentToUser : addCommentToUser,
            removeCommentFromUser : removeCommentFromUser,
            getUsers : getUsers
        };

        return api;

        function loggedIn() {
            return $http.get("/project/api/loggedIn");
        }

        function login(username, password) {
            var user = {
                username:  username,
                password:  password
            };
            return $http.post("/project/api/login",user);
        }

        function logout() {
            return $http.post("/project/api/logout");
        }

        function register(newUser) {
            var user = {
                username: newUser.username,
                password: newUser.password
            };
            return $http.post("/project/api/register",user);
        }

        function createUser(newUser) {
            var user = {
                username: newUser.username,
                password: newUser.password
            };
            return $http.post("/project/api/user",user);
        }

        function findUserById(id) {
            var url = "/project/api/user/"+id;
            return $http.get(url);
        }

        function findUserByUsername(username) {
            var url = "/project/api/user?username=" + username;
            return $http.get(url);
        }

        function findUserByUsernameAndPassword(username, password) {
            var url = "/project/api/user?username=" + username + "&password=" + password;
            return $http.get(url);
        }

        function updateUser(id, newUser) {
            var url = "/project/api/user/" + id;
            return $http.put(url, newUser);
        }

        function deleteUser(userId) {
            var url = "/project/api/user/" + userId;
            return $http.delete(url);
        }

        function findCommentsForUser(userId) {
            var url = "/project/api/user/"+ userId+"/comments";
            return $http.get(url);
        }

        function addCommentToUser(userId, commentId) {
            var url = "/project/api/user/"+ userId+"/comment/"+commentId;
            return $http.get(url);
        }

        function removeCommentFromUser(userId, commentId) {
            var url = "/project/api/user/"+ userId+"/comment/"+commentId;
            return $http.delete(url);
        }
        function getUsers(){
            var url = "/project/api/users/";
            return $http.get(url);
        }
    }
})();