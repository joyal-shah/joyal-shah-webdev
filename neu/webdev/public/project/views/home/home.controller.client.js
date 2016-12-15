(function(){
    (function(){
        angular
            .module("CampApp")
            .controller("HomeController", HomeController);

        function HomeController($location,ProjectUserService,$rootScope) {

            var vm = this;
            vm.GetMeetUpEvents = GetMeetUpEvents;
            vm.logout = logout;

            function GetMeetUpEvents(searchQuery) {
                $location.url("/meetup/" + searchQuery);
            }

            function logout() {
                ProjectUserService
                    .logout()
                    .then(function () {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    });
            }
        }
    })();
})();