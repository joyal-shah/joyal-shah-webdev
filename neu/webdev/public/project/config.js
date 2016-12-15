(function () {
    angular
        .module("CampApp")
        .config(Config);

    function Config($routeProvider) {

        $routeProvider
            .when("/", {
                templateUrl: "views/home/home.view.client.html",
                controller : "HomeController",
                controllerAs : "model"
            })
            .when("/index.html", {
                templateUrl: "views/home/home.view.client.html",
                controller : "HomeController",
                controllerAs : "model"
            })
            .when("/home", {
                templateUrl: "views/home/home.view.client.html",
                controller : "HomeController",
                controllerAs : "model"
            })
            .when("/login", {
                templateUrl : "views/user/login.view.client.html",
                controller : "LogInController",
                controllerAs : "model"
            })
            .when("/meetup/:searchTerm", {
                templateUrl: "views/meetup/meetup-list.view.client.html",
                controller: "MeetUpSearchController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl : "views/user/register.view.client.html",
                controller : "RegisterController",
                controllerAs : "model"
            })
            .when("/user", {
                templateUrl: "views/user/user-profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    loggedIn : checkLoggedIn
                }
            })
            .when("/admin", {
            templateUrl: "views/user/admin-profile.view.client.html",
            controller: "ProfileController",
            controllerAs: "model",
            resolve: {
                loggedIn : checkLoggedIn,
                checkAdmin: checkAdmin
            }
        })
            .when("/user/:userId/events", {
                templateUrl: "views/meetup/meetup-list.view.client.html",
                controller: "FavouriteEventsController",
                controllerAs: "model",
                resolve: {
                    loggedIn : checkLoggedIn
                }
            })
            .when("/user/:userId/events/:searchTerm", {
                templateUrl: "views/meetup/meetup-list.view.client.html",
                controller: "EventSearchController",
                controllerAs: "model",
                resolve: {
                    loggedIn : checkLoggedIn
                }
            })
            .when("/user/:userId/event/:eventId", {
                templateUrl: "views/meetup/meetup-list.view.client.html",
                controller: "EventSearchController",
                controllerAs: "model",
                resolve: {
                    loggedIn : checkLoggedIn
                }
            })
            .when("/group/:groupUrl/event/:meetupId", {
                templateUrl: "views/event/event-detail.view.client.html",
                controller: "EventDetailController",
                controllerAs: "model",
                resolve: {
                    loggedIn : checkLoggedIn
                }
            })
            .when("/user/:userId/group/:groupId/meetup/:meetupId/event/:eventId/comment/new", {
                templateUrl: "views/comment/new-comment.view.client.html",
                controller: "NewCommentController",
                controllerAs: "model",
                resolve: {
                    loggedIn : checkLoggedIn
                }
            })
            .when("/user/:userId/group/:groupId/meetup/:meetupId/event/:eventId/comment/:commentId/edit", {
                templateUrl: "views/comment/edit-comment.view.client.html",
                controller: "EditCommentController",
                controllerAs: "model",
                resolve: {
                    loggedIn : checkLoggedIn
                }
            })
            .when("/admin/view/:userId", {
                templateUrl: "views/user/view-user.view.client.html",
                controller: "ViewUserController",
                controllerAs: "model",
                resolve: {
                    loggedIn : checkLoggedIn
                }
            })
            .when("/admin/edit/:userId", {
                templateUrl: "views/user/edit-user.view.client.html",
                controller: "EditUserController",
                controllerAs: "model",
                resolve: {
                    loggedIn : checkLoggedIn
                }
            })
            .otherwise ({
                redirectTo : "/"
            });

        function checkLoggedIn(ProjectUserService, $location, $q, $rootScope) {

            var deferred = $q.defer();

            ProjectUserService
                .loggedIn()
                .then(
                    function(response){
                        var user = response.data;
                        //console.log(user);
                        if(user == '0') {
                            $rootScope.currentUser = null;
                            deferred.reject();
                            $location.url("/login");
                        }
                        else{
                            $rootScope.currentUser = user;
                            deferred.resolve();
                        }
                    },
                    function(err){
                        $location.url("/login");
                    }
                );

            return deferred.promise;
        }

        function checkAdmin($rootScope,$q,$location){
            var deferred = $q.defer();

            if($rootScope.currentUser != null){
                if(!$rootScope.isAdmin){
                    deferred.reject();
                    $location.url("/user");
                }
                else{
                    deferred.resolve();
                }
            }

            return deferred.promise;
        }
    }
})();