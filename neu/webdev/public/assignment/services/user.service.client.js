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
            updateUser: updateUser,
            deleteUser: deleteUser
        };
        return api;

        // Generates a unique random integer
        function getNewUserId() {
            var date = new Date();

            var components = [
                date.getYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            ];

            var id = components.join("");

            return id;
        }

        // Adds the user parameter instance to the local users array
        function createUser(user) {
            var newUser = {
                _id: getNewUserId(),
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
            /*
             for(var index=0;index<users.length;index++){
             if(users[index] === userId){
             users.splice(index,1);
             break;
             }
             }
             return users;*/
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
