(function(){

    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService(){

        var users = [
            {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
            {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
            {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
        ];

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
        function getNewUserId(){
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
        function createUser(user){
            if(!findUserByUsername(user.username)){
                var newUser = {_id: getNewUserId(),
                    username: user.username,
                    password: user.password,
                    firstName: "",
                    lastName: ""  };

                users.push(newUser);

                return newUser;
            }
            else{
                return null;
            }
        }

        // Returns the user in local users array whose username matches the parameter username
        function findUserByUsername(username){

            userFound = null;

            for(var u in users){
                user = users[u];
                if(user.username === username){
                    userFound = user;
                    break;
                }
            }
            return userFound;
        }

        // Updates the user in local users array whose _id matches the userId parameter
        function updateUser(userId, user){
            updateSuccessful = false;
            for(var u in users){
                curUser = users[u];
                if(curUser._id === userId){
                    curUser.firstName = user.firstName;
                    curUser.lastName = user.lastName;
                    updateSuccessful = true;
                    break;
                }
            }
            return updateSuccessful;
        }

        // Removes the user whose _id matches the userId parameter
        function deleteUser(userId){
            for(var index=0;index<users.length;index++){
                if(users[index] === userId){
                    users.splice(index,1);
                    break;
                }
            }
            return users;
        }

        // Returns the user whose username and password match the username and password parameters
        function findUserByCredentials(username, password){
            userFound = null;

            for(var u in users){
                user = users[u];
                if(user.username === username && user.password === password){
                    userFound = user;
                    break;
                }
            }
            return userFound;
        }

        // Returns the user in local users array whose _id matches the userId parameter
        function findUserById(userId){

            userFound = null;

            for(var u in users){
                user = users[u];
                if(user._id === userId){
                    userFound = user;
                    break;
                }
            }
            return userFound;
        }
    }

})();
